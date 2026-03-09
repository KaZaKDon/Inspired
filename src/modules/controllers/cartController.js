import {
    API_URL
} from "../const";
import {
    getData
} from "../getData";
import {
    renderCard
} from "../render/renderCard";
import {
    renderCart
} from "../render/renderCart";
import {
    renderHero
} from "../render/renderHero";
import {
    renderNavigation
} from "../render/renderNavigation";
import {
    renderOrder
} from "../render/renderOrder";
import {
    renderProducts
} from "../render/renderProducts";

// ✅ Хранилище товаров в корзине
export const cartGoodsStore = {
    goods: [],

    _add(product) {
        if (!product || !product.id) return; // защита от undefined
        const exists = this.goods.some(item => item.id === product.id);
        if (!exists) this.goods.push(product);
    },

    add(goods) {
        if (Array.isArray(goods)) {
            goods.forEach(product => this._add(product));
        } else {
            this._add(goods);
        }
    },

    getProduct(id) {
        if (!id) return null;
        return this.goods.find(item => item.id === id) || null;
    }
};

export const calcTotalPrice = {
    elemTotalPrice: null,
    elemCount: null,
    update() {
        const cartGoods = getCart();
        this.count = cartGoods.length;
        this.totalPrice = cartGoods.reduce((sum, item) => {
            const product = cartGoodsStore.getProduct(item.id);
            return product.price * item.count + sum
        }, 0);
        this.writeTotal()
    },

    writeTotal (elem = this.elemTotalPrice) {
        if (elem) {
            this.elemTotalPrice = elem;
            elem.textContent = `руб  ${this.totalPrice}`
        }
    }
}

// ✅ Работа с localStorage
export const getCart = () => {
    try {
        const data = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(data)) throw new Error("Cart data corrupted");
        return data.filter(item => item && item.id); // фильтруем битые
    } catch (e) {
        console.warn("Ошибка чтения корзины:", e);
        localStorage.removeItem("cart");
        return [];
    }
};

export const addProductCart = (product, equal) => {
    if (!product || !product.id) return;

    const cart = getCart();
    let isUpdated = false;

    const updated = cart.map(item => {
        if (
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
        ) {
            item.count = equal ?
                product.count :
                (+item.count || 0) + (+product.count || 1);
            isUpdated = true;
        }
        return item;
    });

    if (!isUpdated) updated.push(product);

    localStorage.setItem("cart", JSON.stringify(updated));
};

export const removeCart = (product) => {
    if (!product || !product.id) return;
    const updated = getCart().filter(
        item =>
        !(
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
        )
    );
    localStorage.setItem("cart", JSON.stringify(updated));
};

export const clearCart = () => {
    localStorage.removeItem('cart')
}

// ✅ Контроллер корзины
export const cartController = async () => {
    const idList = getCart().map(item => item.id).filter(Boolean);
    if (!idList.length) {
        console.warn("Корзина пуста");
        renderCart({
            render: true,
            cartGoodsStore
        });
        return;
    }

    try {
        const data = await getData(`${API_URL}/api/goods?list=${idList.join(",")}&count=all`);

        // ✅ теперь проверяем, если data — массив
        const goodsArray = Array.isArray(data) ? data : data.goods;
        if (!goodsArray || !goodsArray.length) {
            console.error("Сервер вернул пустой массив:", data);
            return;
        }

        cartGoodsStore.add(goodsArray);

        renderNavigation({
            render: false
        });
        renderHero({
            render: false
        });
        renderCard({
            render: false
        });
        renderProducts({
            render: false
        });
        renderCart({
            render: true,
            cartGoodsStore
        });
        renderOrder({
            render: true
        });
    } catch (err) {
        console.error("Ошибка загрузки корзины:", err);
    }
};