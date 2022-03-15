import {
    LocalDB
} from "./model.js";
import {
    Notify
} from "./notify.js";


export class Basket {
    constructor() {
        if (Basket.exist) {
            return Basket.instance;
        }
        Basket.instance = this;
        Basket.exist = true;

        this.connect();
        this.initDOM();
        this.operations()

    }

    initDOM() {
        this.wrap = document.querySelector("#offcanvas-cart");
        this.body = this.wrap.querySelector(".body");
        this.ulEl = this.wrap.querySelector(".minicart-product-list");
    }
    connect() {
        this.notify = new Notify();
        this.localDB = new LocalDB();
    }
    operations() {
        this.showBasket();
        this.creatProduct();
        this.removeItem();
        this.clearCart();
        this.changeItemsCount();

    }

    initBasket = async () => {
        await this.localDB.init();
        const users = await this.localDB.getUsers();
        const baskets = await this.localDB.getBaskets();

        if (baskets.length == 0) {
            users.forEach(user => {
                let basket = {
                    id: user.id,
                    login: user.login,
                    cart: []
                }
                this.localDB.addBasket(basket);
            });
        }
    }


    showBasket = async () => {
        await this.localDB.init();
        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        this.ulEl.innerHTML = "";

        if (this.user.login) {
            let baskets = await this.localDB.getBaskets();
            let products = await this.localDB.getProducts();

            let currentBasket = baskets.find(basket => basket.login == this.user.login);

            this.showCount(currentBasket.cart);
            this.showPrice(currentBasket.cart);
            this.ulEl.innerHTML = this.renderHtml(currentBasket.cart, products);
        }
    }


    renderHtml(cart, products) {
        let productsHtml = cart.map(product => {
            let current = products.find(item => item.id == product.product_id);

            return `<li class="cart_item" data-id="${product.product_id}">
                        <a href="#" class="image">
                            <img src="${current.thumbnail}" alt="Cart product Image">
                        </a>
                        <div class="content">
                            <a href="#" class="title">${product.title}</a>
                                <span class="quantity-price">
                                    <form>
                                        <input type="text" class="product_count" value="${product.count}">
                                    </form>
                                    
                                     x 
                                    <span class="amount">$${product.price}</span> 
                                    = <span class="amount">$${product.total}</span>
                                </span>
                            <a href="#" class="remove">×</a>
                        </div>
                    </li>`;
        })

        return productsHtml.join("");
    }

    creatProduct = async () => {
        let productWrap = document.querySelector(".main_card");
        if (!productWrap) {
            return
        }

        productWrap.addEventListener("click", (e) => {
            if (!e.target.classList.contains("add-to-cart")) return;
            let parrentEl = e.target.closest(".product");

            let product = {
                product_id: parrentEl.dataset.id,
                title: parrentEl.dataset.title,
                count: 1,
                price: parrentEl.dataset.price,
                total: parrentEl.dataset.price,
            };

            this.check(product);
        });
    }

    check = async (product) => {
        let baskets = await this.localDB.getBaskets();
        let i;
        if (!this.user.login) {
            this.notify.showNotification(this.wrap, "notification", "Необходимо авторизоваться");
            return
        }
        let currentBasket = baskets.find(basket => basket.login == this.user.login);
        let flag = currentBasket.cart.find(item => item.product_id == product.product_id);

        if (flag) {
            this.notify.showNotification(this.wrap, "notification", "The product already exists in the cart");
            return;
        } else {
            currentBasket.cart.push(product);
            await this.localDB.changeBasket(currentBasket, () => {
                this.notify.showNotification(this.wrap, "notification", "Product created in basket");
                this.showBasket();
            });
        }
    }

    showCount(cart) {
        let countEl = document.querySelector(".header-action-num");
        countEl.textContent = cart.length;
    }

    showPrice(cart) {
        let amount = cart.reduce((prev, currnet) => (prev + Number(currnet.total)), 0);
        let amountEl = document.querySelector(".cart-amount");
        let titleEl = this.wrap.querySelector(".title");
        titleEl.textContent = "Cart $" + amount;
        amountEl.textContent = "$" + amount;
    }

    removeItem = async () => {
        this.body.addEventListener('click', async (e) => {
            if (!e.target.classList.contains("remove")) return;

            // e.preventDefault();
            let parrnetEl = e.target.closest(".cart_item");
            let id = parrnetEl.dataset.id;
            let baskets = await this.localDB.getBaskets();
            let currentBasket = baskets.find(basket => basket.login == this.user.login);

            let newCart = currentBasket.cart.filter(product => product.product_id != id)
            currentBasket.cart = newCart;
            this.localDB.changeBasket(currentBasket, () => {
                this.notify.showNotification(this.wrap, "notification", "product removed");
                this.showBasket();
            });
        })
    }

    clearCart() {
        document.querySelector(".clear-cart").addEventListener("click", async (e) => {
            e.preventDefault();
            let baskets = await this.localDB.getBaskets();
            let currentBasket = baskets.find(basket => basket.login == this.user.login);
            currentBasket.cart.length = 0;
            this.localDB.changeBasket(currentBasket, () => {
                this.notify.showNotification(this.wrap, "notification", "all items removed");
                this.showBasket();
            });
        })
    }

    changeItemsCount() {
        this.body.addEventListener("change", async (e) => {
            if (!e.target.classList.contains("product_count")) return
            let baskets = await this.localDB.getBaskets();
            let currentBasket = baskets.find(basket => basket.login == this.user.login);
            let id = e.target.closest(".cart_item").dataset.id;
            if (e.target.value <= 1) {
                e.target.value = 1;
            }
            currentBasket.cart.forEach(product => {
                if (product.product_id == id) {
                    product.count = e.target.value;
                    product.total = product.price * product.count;
                }
            });

            this.localDB.changeBasket(currentBasket, this.showBasket.bind(this));
        })
    }

    closeCanvas() {
        this.wrap.classList.remove("offcanvas-open");
        document.querySelector(".offcanvas-overlay").style.display = "none";
    }
}