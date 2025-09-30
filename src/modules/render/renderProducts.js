import {
    getData
} from "../getData";
import {
    API_URL,
    COUNT_PAGINATION,
    DATA
} from "../const";
import { createElement } from "../utils/createElement";
import { renderPagination } from "./renderPagination";
import { router } from "../utils/router";
import { products } from '../const'
import { getFavorite } from "../controllers/favoriteController";

export const renderProducts = async (title, params) => {
    
    products.textContent = '';

    const data = await getData(`${API_URL}/api/goods`, params);


    // Определяем goods в зависимости от формата data
    let goods;
    if (Array.isArray(data)) {
        goods = data; // Для главной страницы: data — массив
    } else if (data && Array.isArray(data.goods)) {
        goods = data.goods; // Для категорий: data — объект с goods
    } else {
        goods = []; // Фолбек, если формат неожиданный
    }

    // Проверка: goods должен быть массивом
    if (!Array.isArray(goods)) {
        console.error('renderProducts: goods is not an array. Received:', goods, 'Full data:', data);
        createElement('p', {
            textContent: 'Ошибка загрузки товаров. Попробуйте позже.',
            className: 'error-message'
        }, {
            parent: products
        });
        return;
    }

    // Если goods — пустой массив, просто ничего не рендерим
    if (goods.length === 0) {
        createElement('p', {
            textContent: 'Товары не найдены.',
            className: 'no-products'
        }, {
            parent: products
        });
        return;
    }

    const container = createElement('div', {
        className: 'container'
    }, {
        parent: products
    })

    const titleElem = createElement('h2', {
        className: 'goods__title',
        textContent: title
    }, {
        parent: container
    });

    if (Object.hasOwn(data, 'totalCount')) {
        createElement('sup', {
            class: 'goods__title-sup',
            innerHTML: `&nbsp(${data?.totalCount})`
        }, {parent: titleElem});

        if (!data.totalCount) {
            createElement('p', {
                className: 'goods__warning',
                textContent: 'По Вашему запросу ничего не найдено.'
            },
            {
                parent: container
            })

            return
        }
    }

    const favoriteList = getFavorite()

    const listCard = goods.map(product => {
        const li = createElement('li', {
            className: 'goods__item'
        });

        const article = createElement('article', {
            className: 'product',
            innerHTML: `
            <a href="#/product/${product.id}" class="product__link">
                <img src="${API_URL}/${product.pic}" alt="${product.title}" class="product__image"></img>
                <h3 class="product__title">${product.title}</h3>
            </a>
            <div class="product__row">
                <p class="product__price">руб ${product.price}</p>
                <button class="product__btn-favorite favorite ${favoriteList.includes(product.id) ? 'favorite_active' : ''}" aria-label="Добавить в избранное" data-id=${product.id}></button>
            </div>
        `
        }, {
            parent: li
        });

        const colors = createElement('ul', {
            className: 'product__color-list'
        }, {
            parent: article,
        });

        product.colors.forEach((colorID, i) => {
            const color = DATA.colors.find(item => item.id == colorID);
            const colorLi = createElement('li', {
                className: 'product__color-item'
            }, {
                parent: colors // Вставляем li в ul
            });
            createElement('div', {
                className: `color color_${color.title} ${i === 0 ? 'color_check' : ''}`
            }, {
                parent: colorLi // Вставляем div в li
            });
        });

        return li;
    });


    const list = createElement('ul', {
        className: 'goods__list'
    }, {
        appends: listCard,
        parent: container
    })

    const page = data && data.page ? data.page : 1;  // Дефолт 1
    const pages = data && data.pages ? data.pages : 1;  // Дефолт 1

    if (pages > 1) {
        const pagination = createElement('div', {
            className: 'goods__pagination pagination'
        }, {
            parent: container
        });

        renderPagination(pagination, page, pages, COUNT_PAGINATION, router);
    }
};