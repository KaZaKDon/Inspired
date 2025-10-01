import { products } from "../const"
import { renderProducts } from "../render/renderProducts";
import { renderHero } from "../render/renderHero";
import { renderNavigation } from "../render/renderNavigation";
import { renderCard } from "../render/renderCard";
import { renderCart } from "../render/renderCart";

export const getFavorite = () => JSON.parse(localStorage.getItem('favorite') || '[]')
export const addFavorite = (id) => {
    const favoriteList = getFavorite();
    favoriteList.push(id);
    localStorage.setItem('favorite', JSON.stringify(favoriteList))
}

export const removeFavorite = (id) => {
    const favoriteList = getFavorite();
    const index = favoriteList.findIndex(item => item === id);

    if (index == -1) return

    favoriteList.splice(index, 1);

    localStorage.setItem('favorite', JSON.stringify(favoriteList))
}

export const handlerFavorite = (e) => {
    const target = e.target;

    if (target.closest('.favorite_active')) {
        removeFavorite(target.dataset.id)
        target.classList.remove('favorite_active');

        return
    }

    if (target.closest('.favorite')) {
        addFavorite(target.dataset.id)
        target.classList.add('favorite_active');
        console.log(getFavorite());
        
        return
    }
}

products.addEventListener('click', handlerFavorite
    )

export const favoriteController = () => {
    renderNavigation({repeat: true, render: true});
    renderHero({render: false});
    renderCard({render: false})
    renderProducts({title: 'Избранное', params: {list: getFavorite()}, render: true});
    renderCart({render: false});
    renderOrder({render: false});
}