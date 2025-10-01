import './index.html';
import './index.scss';

import { router } from './modules/utils/router';
import { mainPageController } from './modules/controllers/mainPageController';
import { renderFooter } from './modules/render/renderFooter';
import { renderHeader } from './modules/render/renderHeader';
import { getData } from './modules/getData';
import { API_URL, DATA, main } from './modules/const';
import { createScssColors } from './modules/createScssColors';
import { createElement } from './modules/utils/createElement';
import { searchPageController } from './modules/controllers/searchController';
import { categoryPageController } from './modules/controllers/categoryPageController';
import { favoriteController } from './modules/controllers/favoriteController';
import { cardController } from './modules/controllers/cardController';
import { cartController } from './modules/controllers/cartController';

const init = async () => {
    try {
        DATA.navigation = await getData(`${API_URL}/api/categories`)
        DATA.colors = await getData(`${API_URL}/api/colors`)

    createScssColors(DATA.colors)

    router.on('*', () => {
        renderHeader()
        renderFooter()
    })

    router.on('/', () => {
        mainPageController();
    })

    router.on('/women', () => {
        mainPageController('women');
    })

    router.on('/men', () => {
        mainPageController('men');
    })

    router.on('/kids', () => {
        mainPageController('kids');
    })

    router.on('/:gender/:category',categoryPageController)

    router.on('/product/:id',cardController)

    router.on('/cart', cartController)

    router.on('/search', searchPageController)

    router.on('/favorite', favoriteController)

    router.resolve()

    } catch {
        createElement('h2', {
            textContent: 'Что то пошло не так. Попробуйте позже'
        },
        {
            parent: main,
            cb(h2) {
                h2.style.textAlign = 'center'
            }
        })      
    }
}

init()