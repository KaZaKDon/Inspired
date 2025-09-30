import {
    router
} from '../utils/router'
import {
    renderNavigation
} from '../render/renderNavigation'
import {
    renderHero
} from '../render/renderHero'
import {
    renderProducts
} from '../render/renderProducts'
import { renderCard } from '../render/renderCard'

export const searchController = formSearch => {
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();

        router.navigate(`search?value=${formSearch.search.value}`)
    })

}

export const searchPageController = (routerData) => {
    const params = {
        search: routerData.params.value,
        count: 8
    };

    if (routerData.params?.page) {
        params.page = routerData.params.page;
    }

    renderNavigation('all');
    renderHero(false);
    renderCard(false)
    renderProducts(routerData.params.value, params);
}