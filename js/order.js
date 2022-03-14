import {
    LocalDB
} from "./model.js";
import {
    Notify
} from "./notify.js";



export class Order {
    constructor() {
        this.initDom();
        this.localDB = new LocalDB();
        this.notify = new Notify();

        this.operations();
    }

    initDom() {
        this.buyEl = document.querySelector(".buy-items");

    }
    operations() {
        this.localDB.init();
        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        this.generateModal();
        // this.getOrder();
    }

    getOrder() {
        this.buyEl.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!this.user.login) {
                return
            }

            let baskets = await this.localDB.getBaskets();
            let currentBasket = baskets.find(basket => basket.login == this.user.login);

            if (currentBasket.cart.length <= 0) return;

            let amount = currentBasket.cart.reduce((prev, currnet) => (prev + Number(currnet.total)), 0);

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
                                        <input type="text" class="form-control" id="floatingInput" placeholder="full name">
                                        <label for="floatingInput">Full name</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="floatingNumber" placeholder="Phone number">
                                        <label for="floatingNumber">Phone number</label>
                                    </div>
                                    <div class="btn_center">
                                        <button class="cart-btn-2" type="submit">Apply Coupon</button>
                                        <button class="cart-btn-2" type="submit">Apply Coupon</button>
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
    }

}