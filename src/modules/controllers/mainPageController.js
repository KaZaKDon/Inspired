import { renderProducts } from "../render/renderProducts"
import { renderHero } from '../render/renderHero'
import { renderNavigation } from '../render/renderNavigation'
import { renderCard } from "../render/renderCard"
import { renderCart } from "../render/renderCart"
import { renderOrder } from "../render/renderOrder"


export const mainPageController = (gender = 'women') => {
    
    renderNavigation({gender, render: true})
    renderHero({gender, render: true})
    renderCard({render: false})
    renderProducts({title:'Новинки', params:{gender}, render: true})
    renderCart({render: false});
    renderOrder({render: false});
}