import './index.html';
import './index.scss';

import { router } from './modules/router';
import { mainPage } from './modules/mainPage/mainPage';
import { renderFooter } from './modules/render/renderFooter';
import { renderHeader } from './modules/render/renderHeader';
    
import { womenMainPage } from './modules/mainPage/womenMainPage'
import { menMainPage } from './modules/mainPage/menMainPage'


router.on('*', () => {
    renderHeader()
    renderFooter()
})

router.on('/', () => {
    mainPage();
})

router.on('/women', () => {
    mainPage('women');
})

router.on('/men', () => {
    mainPage('men');
})

router.resolve()