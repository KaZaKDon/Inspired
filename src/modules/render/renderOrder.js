import { createElement } from '../utils/createElement';
import { API_URL, order } from '../const';
import { calcTotalPrice, cartGoodsStore, clearCart, getCart } from '../controllers/cartController';
import { sendOrder } from '../controllers/orderController';
import { router } from '../utils/router';

/**
 * Показывает модальное окно с информацией о заказе
 */
export const showOrderInfo = (data) => {
  const modal = createElement('div', { className: 'modal' }, {
    parent: document.body,
    cb(el) {
      el.addEventListener('click', e => {
        if (e.target === el) {
          el.remove();
          router.navigate('/');
        }
      });
    }
  });

  const modalBody = createElement('div', { className: 'modal__body' }, { parent: modal });

  modalBody.insertAdjacentHTML('beforeend', `
    <h2 class="modal__title">Заказ оформлен №${data.id}</h2>
    <p class="modal__description modal__description_thank">
      Спасибо за выбор нашего магазина!
    </p>
    <p class="modal__description">Здесь вы можете посмотреть все детали вашего заказа.</p>

    <ul class="modal__customer-data customer">
      <li class="customer__item">
        <span class="customer__item-title">Получатель</span>
        <span class="customer__item-data">${data.fio}</span>
      </li>

      ${data.address ? `
        <li class="customer__item">
          <span class="customer__item-title">Адрес доставки</span>
          <span class="customer__item-data">${data.address}</span>
        </li>` : ''}

      <li class="customer__item">
        <span class="customer__item-title">Телефон</span>
        <span class="customer__item-data">${data.phone}</span>
      </li>

      ${data.email ? `
        <li class="customer__item">
          <span class="customer__item-title">E-mail</span>
          <span class="customer__item-data">${data.email}</span>
        </li>` : ''}

      <li class="customer__item">
        <span class="customer__item-title">Способ получения</span>
        <span class="customer__item-data">${
          { self: 'Самовывоз', delivery: 'Доставка' }[data.delivery]
        }</span>
      </li>
    </ul>
  `);

  // список товаров
  const goodsList = createElement('ul', { className: 'modal__goods goods-list' }, { parent: modalBody });

  data.order.forEach(item => {
    const product = cartGoodsStore.getProduct(item.id);
    if (!product) return;

    const goodsListItem = createElement('li', { className: 'goods-list__item' }, { parent: goodsList });

    createElement('img', {
      className: 'goods-list__img',
      src: `${API_URL}/${product.pic}`,
      alt: product.title,
    }, { parent: goodsListItem });

    createElement('p', {
      className: 'goods-list__count',
      textContent: `X${item.count}`
    }, { parent: goodsListItem });
  });

  // Итого (один раз!)
  const cartTotal = createElement('div', {
    className: 'modal__total',
    innerHTML: '<p class="modal__total-title">Итого:</p>'
  }, { parent: modalBody });

  createElement('p', {
    className: 'modal__total-price',
    textContent: 'руб '
  }, {
    parent: cartTotal,
    append: createElement('span', {}, {
      cb(elem) {
        calcTotalPrice.writeTotal(elem);
      }
    })
  });

  // кнопка закрытия
  createElement('button', {
    className: 'modal__close',
    innerHTML: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8L8 16" stroke="black" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M16 16L8 8" stroke="black" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`
  }, {
    parent: modalBody,
    cb(el) {
      el.addEventListener('click', () => {
        modal.remove();
        router.navigate('/');
      });
    }
  });

  clearCart();
};

/**
 * Отрисовывает форму оформления заказа
 */
export const renderOrder = ({ render }) => {
  order.textContent = '';

  if (!render) return;

  const container = createElement('div', {
    className: 'container',
    innerHTML: `<h2 class="order__title">Оформление заказа</h2>`
  }, { parent: order });

  const orderForm = createElement('form', { className: 'order__form' }, {
    parent: container,
    cb(form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.order = getCart();

        if (data.order.length) {
          sendOrder(data).then(dataOrder => {
            showOrderInfo(dataOrder);
          });
        }
      });
    }
  });

  orderForm.insertAdjacentHTML('beforeend', `
    <fieldset class="order__personal">
      <label class="order__label">
        <input class="order__input" type="text" placeholder="ФИО" name="fio" required>
      </label>
      <label class="order__label">
        <input class="order__input" type="text" placeholder="Адрес доставки" name="address">
      </label>
      <label class="order__label">
        <input class="order__input" type="text" placeholder="Телефон" name="phone" required>
      </label>
      <label class="order__label">
        <input class="order__input" type="text" placeholder="E-mail" name="email">
      </label>
    </fieldset>

    <fieldset class="order__radio-list">
      <label class="order__radio radio">
        <input class="radio__input" type="radio" name="delivery" value="delivery" required>
        <span class="radio__text">Доставка</span>
      </label>
      <label class="order__radio radio">
        <input class="radio__input" type="radio" name="delivery" value="self" required>
        <span class="radio__text">Самовывоз</span>
      </label>
    </fieldset>

    <button class="order__submit main-button" type="submit">Оформить</button>
  `);
};