import { DATA } from "../const";
import { renderProducts } from "../render/renderProducts";
import { renderHero } from "../render/renderHero";
import { renderNavigation } from "../render/renderNavigation";
import { renderCard } from "../render/renderCard";
import { renderOrder } from "../render/renderOrder";
import { renderCart } from "../render/renderCart";

export const categoryPageController = (routerData) => {
    const { gender, category } = routerData.data;

    if (!Object.keys(DATA.navigation).includes(gender)) {
        return;
    }
    const params = { gender, category, count: 8 };
    if (routerData.params?.page) {
        params.page = routerData.params.page;
    }
    const categoryItem = DATA.navigation[gender]?.list?.find((item) => item.slug === category);
    if (!categoryItem) {
        console.error('Категория не найдена!');
        return;
    }
    const { title } = categoryItem;
    renderNavigation({gender, category, render: true});
    renderHero({render: false});
    renderCard({render: false})
    renderProducts({title, params, render:true});
    renderCart({render: false});
    renderOrder({render: false});
};