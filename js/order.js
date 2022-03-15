import {
    LocalDB
} from "./model.js";
import {
    Notify
} from "./notify.js";
import {
    Basket
} from "./basket.js";



export class Order {
    constructor() {
        this.initDom();
        this.localDB = new LocalDB();
        this.notify = new Notify();
        this.basket = new Basket();
        this.operations();
    }

    initDom() {
        this.buyEl = document.querySelector(".buy-items");

    }
    operations() {

        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        this.generateModal();
        this.closeModal();
        this.getOrder();
    }

    getOrder() {
        if (!this.user.login) {
            return
        }

        const butEl = this.modalWrap.querySelector(".buy");
    
        butEl.addEventListener("click", async (e) => {
            e.preventDefault();

            await this.localDB.init();

            let nameEl = this.modalWrap.querySelector("#fullname");
            let numberEl = this.modalWrap.querySelector("#phone-number");

            let name = nameEl.value.trim();
            let number = numberEl.value.trim();

            if (name == "") {
                this.notify.showMessage(nameEl, "message", "Необходимо заполнить имя заказчика")
                return
            } else if (number == "") {
                this.notify.showMessage(numberEl, "message", "Необходимо заполнить номер телефона заказчика")
                return
            }

            let baskets = await this.localDB.getBaskets();
            let currentBasket = baskets.find(basket => basket.login == this.user.login);

            if (currentBasket.cart.length == 0) {
                this.notify.showMessage(nameEl, "message", "Корзина пусто !");
                return
            }

            let newOrder = {
                login: this.user.login,
                fullname: name,
                phone: number,
                order: [...currentBasket.cart],
                status: "new",
            }

            await this.localDB.addOrder(newOrder, () => {
                currentBasket.cart.length = 0;
                this.localDB.changeBasket(currentBasket);
                this.closeModalAction();
                this.basket.closeCanvas();
                this.basket.showBasket();
                this.notify.showNotification(document.body, "notification", "Спасибо за Ваш заказ");
            });
        })
    }

    generateModal() {
        let html = `
        <div class="modal modal-2 fade" id="orderModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12 col-sm-12 col-xs-12 mb-lm-30px mb-md-30px mb-sm-30px">
                                <form>
                                    <div class="form-floating mb-3">
                                        <input type="text" id="fullname" class="form-control" id="floatingInput" placeholder="full name">
                                        <label for="floatingInput">Full name</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" id="phone-number" class="form-control" id="floatingNumber" placeholder="Phone number">
                                        <label for="floatingNumber">Phone number</label>
                                    </div>
                                    <div class="btn_center">
                                        <button class="cart-btn-2 close" type="submit">Close</button>
                                        <button class="cart-btn-2 buy" type="submit">Buy</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML("afterbegin", html);
        this.modalWrap = document.querySelector("#orderModal");
    }


    closeModal() {
        const closeEl = this.modalWrap.querySelector(".close");
        closeEl.addEventListener("click", (e) => {
            e.preventDefault();
            this.closeModalAction();
        })
    }

    closeModalAction() {
        document.body.classList.toggle("modal-open");
        this.modalWrap.classList.toggle("show");
        this.modalWrap.style.display = "none";
        document.querySelector(".modal-backdrop").remove();
    }
}