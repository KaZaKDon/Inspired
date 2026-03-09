import { DATA } from "../const";
import { renderProducts } from "../render/renderProducts";
import { renderHero } from "../render/renderHero";
import { renderNavigation } from "../render/renderNavigation";

export const categoryPageController = (routerData) => {
    const { gender, category } = routerData.data;

    if (!Object.keys(DATA.navigation).includes(gender)) {
        return;
    }
    const params = { gender, category, count: 4 };
    if (routerData.params?.page) {
        params.page = routerData.params.page;
    }
    const categoryItem = DATA.navigation[gender]?.list?.find((item) => item.slug === category);
    if (!categoryItem) {
        console.error('Категория не найдена!');
        return;
    }
    const { title } = categoryItem;
    renderNavigation(gender, category);
    renderHero(false);
    renderProducts(title, params);
};