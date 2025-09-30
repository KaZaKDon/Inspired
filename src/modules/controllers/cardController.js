import { API_URL, DATA } from "../const";
import { renderProducts } from "../render/renderProducts";
import { renderHero } from "../render/renderHero";
import { renderNavigation } from "../render/renderNavigation";
import { getData } from "../getData";
import { renderCard } from "../render/renderCard";

export const cardController = async (routerData) => {
    const { id } = routerData.data;

    const data = await getData(`${API_URL}/api/goods/${id}`)

    console.log(data);
    

    renderNavigation(data.gender, data.category);
    renderHero(false);
    renderCard(data)
    renderProducts('Вам также может понравится', {count: 4, gender: data.gender});
};