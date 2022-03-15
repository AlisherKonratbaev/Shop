import {
    LocalDB
} from "./model.js";


export class User {

    constructor() {
        this.local = new LocalDB();
        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        this.operations();

    }
    operations() {
        this.action();
        this.logout();

        if (this.user.login && this.verify()) {
            this.showOrders();
        }
    }
    action() {
        const ulEl = document.querySelector(".account-menu");

        if (this.user.login) {
            for (let li of ulEl.children) {
                if (li.firstChild.href.includes("login")) li.remove();
            }
        } else {
            for (let li of ulEl.children) {
                if (!li.firstChild.href.includes("login")) li.remove();
            }
        }
    }

    logout() {
        const logoutBtn = document.querySelector("#logout");
        if (!logoutBtn) return
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("authorizedUser");
            window.location.href = "/index.html"
        })
    }

    verify() {
        if (!window.location.href.includes("my-account.html")) {
            return false;
        }
        return true;
    }
    showOrders = async () => {
        await this.local.init();

        let users = await this.local.getUsers();
        let current = users.find(user => user.login == this.user.login);

        if (current.role != "user") return

        let allOrders = await this.local.getOrders();
        let myOrders = allOrders.filter(order => order.login == this.user.login);



        let html = this.getOrders(myOrders);
        document.querySelector(".order-body").innerHTML = html;

        this.generateModal(myOrders);

    }

    getOrders(orders) {

        let html = orders.map((purchase, index) => {
            let amount = purchase.order.reduce((prev, currnet) => (prev + Number(currnet.total)), 0);
            let count = purchase.order.reduce((prev, currnet) => (prev + Number(currnet.count)), 0);
            return `<tr>
                        <td>${index+1}</td>
                        <td><span class="success">${purchase.status == "new" ? "Processing" : "Completed"}</span></td>
                        <td>$${amount}</td>
                        <td>${count}</td>
                        <td><a href="#" class="view" data-bs-toggle="modal" data-bs-target="#viewModal${index+1}">view</a></td>
                    </tr>`;
        });

        return html.join("");
    }

    generateModal(orders) {

        let html = orders.map((purchase, index) => {
            return `<div class="modal modal-2 fade" id="viewModal${index+1}" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table_page table-responsive">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Title</th>
                                                            <th>Price</th>
                                                            <th>Items</th>
                                                            <th>Total price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="order-body">
                                                        ${this.renderProducts(purchase.order)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });

        document.body.insertAdjacentHTML("afterbegin", html.join(""));
    }

    renderProducts(products) {
        let html = products.map((product, index) => {
            return `<tr>
                        <td>${index+1}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.count}</td>
                        <td>$${product.total}</td>
                    </tr>`
        });

        return html.join("");
    }
}