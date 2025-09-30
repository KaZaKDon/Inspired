import { renderProducts } from "../render/renderProducts"
import { renderHero } from '../render/renderHero'
import { renderNavigation } from '../render/renderNavigation'
import { renderCard } from "../render/renderCard"


export const mainPageController = (gender = 'women') => {
    
    renderNavigation(gender)
    renderHero(gender)
    renderCard(false)
    renderProducts('Новинки', {gender})
}