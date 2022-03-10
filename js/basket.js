import {
    ShopDB
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
        this.showBasket();
        this.action();
    }

    initDOM() {
        this.wrap = document.querySelector("#offcanvas-cart");
        this.body = this.wrap.querySelector(".body");
        this.ulEl = this.wrap.querySelector(".minicart-product-list");
    }
    connect() {
        this.local = new ShopDB();
        this.notify = new Notify();
       
    }

    initBasket() {
        this.local.openDB(this.getUsers, this);
    }
    getUsers(db) {
        let transaction = db.transaction('users')
            .objectStore("users")
            .getAll();

        transaction.onsuccess = () => {
            let users = transaction.result;
            users.forEach(user => {
                let basket = {
                    id: user.id,
                    login: user.login,
                    cart: []
                }
                this.creatBasket(basket, db);
            });

        }
        transaction.onerror = () => {
            throw Error("error");
        }
    }

    showBasket() {
        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        if (this.user.login) {
            this.local.openDB(this.getBasket, this);

        } else {
            this.ulEl.innerHTML = "";
        }

    }

    getBasket(db) {
        let transaction = db.transaction('basket')
            .objectStore("basket")
            .getAll();

        transaction.onsuccess = () => {
            let baskets = transaction.result;
            let currentBasket = baskets.find(basket => basket.login == this.user.login);
            this.ulEl.innerHTML = this.renderHtml(currentBasket.cart);
        }
        transaction.onerror = () => {
            throw Error("error");
        }

    }

    renderHtml(products) {
        let productsHtml = products.map(product => {
            return `<li>
                        <a href="#" class="image">
                            <img src="assets/images/product-image/1.jpg" alt="Cart product Image">
                        </a>
                        <div class="content">
                            <a href="#" class="title">${product.title}</a>
                                <span class="quantity-price">${product.count} x <span class="amount">$${product.price}</span> = <span class="amount">$${product.total}</span></span>
                            <a href="#" class="remove">×</a>
                        </div>
                    </li>`;
        })

        return productsHtml.join("");
    }
    getProductImg(id, db) {
        if (db) {
            let transaction = db.transaction('product')
                .objectStore("product")
                .get(+id);

            transaction.onsuccess = () => {
                let product = transaction.result;

            }
            transaction.onerror = () => {
                throw Error("error");
            }

        } else {
            this.local.openDB(this.getProductImg, this);
        }

    }

    creatBasket(basket, db) {
        let transaction = db.transaction('basket', 'readwrite')
            .objectStore("basket")
            .add(basket);

        transaction.onsuccess = () => {

        }
        transaction.onerror = () => {

        }
    }


    action(db) {
        let productWrap = document.querySelector(".main_card");
        if (!productWrap) {
            return
        }

        if (db) {
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


                let transaction = db.transaction('basket')
                    .objectStore("basket")
                    .getAll();

                transaction.onsuccess = () => {
                    let baskets = transaction.result;
                    let i;

                    let currentBasket = baskets.find((basket, index) => {
                        if (basket.login == this.user.login) {
                            i = index;
                            return true;
                        } else return false;
                    });

                    console.log(currentBasket);
                    currentBasket.cart.push(product);

                    let transaction2 = db.transaction('basket', 'readwrite')
                        .objectStore("basket")
                        .put(currentBasket);

                    transaction2.onsuccess = () => {
                        this.notify.showNotification(this.wrap, "notification", "product created in basket");
                        this.showBasket();
                    }
                    transaction2.onerror = () => {
                        throw Error("error");
                    }

                }
                transaction.onerror = () => {
                    throw Error("error");
                }
            });

        } else {
            this.local.openDB(this.action, this);
        }

    }


}