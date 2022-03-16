import {
    LocalDB
} from "./model.js";
import {
    Notify
} from "./notify.js";

export class Admin {
    constructor() {
        this.local = new LocalDB();
        this.notify = new Notify();
        this.user = JSON.parse(sessionStorage.getItem("authorizedUser")) || {}
        this.operations();
    }

    operations = async () => {
        if (!this.user.login) {
            return
        }

        await this.local.init();
        let users = await this.local.getUsers();
        let orders = await this.local.getOrders()
        let products = await this.local.getProducts();

        let current = users.find(user => user.login == this.user.login);

        if (current.role == "admin") {
            this.initDom();
            this.renderMenu();
        }

        if (this.verify() && current.role == "admin") {
            this.showOrders(orders);
            this.generateModal(orders);
            this.changeStatus(orders);

            this.showUsers(users.filter(user => user.login != this.user.login));
            this.showProducts(products);
        }

    }

    verify() {
        if (window.location.href.includes("admin.html")) {
            return true;
        }
        return false;
    }

    initDom() {
        this.ulEl = document.querySelector(".account-menu");
        this.orderBody = document.querySelector(".admin-order-body");
        this.usersBody = document.querySelector(".admin-users-body")
        this.productsBody = document.querySelector(".admin-products-body")
    }

    renderMenu() {
        let adminMenu = `<li><a class="dropdown-item" href="./admin.html">Dashboard</a></li>`;
        this.ulEl.insertAdjacentHTML("beforeend", adminMenu);
    }

    showOrders(orders) {
        let html = this.renderOrders(orders);
        this.orderBody.innerHTML = html;
    }

    renderOrders(orders) {
        let html = orders.map((purchase, index) => {
            return `<tr>
                        <td>${index+1}</td>
                        <td>${purchase.fullname}</td>
                        <td>${purchase.phone} </td>
                        <td><a href="#" class="view" data-bs-toggle="modal" data-bs-target="#viewModal${index+1}">view</a></td>
                        <td><a href="#" data-id="${purchase.id}" class="status ${purchase.status == "new" ? "new" : "success"}">${purchase.status == "new" ? "Processing" : "Completed"}</a>
                        </td>
                    </tr>`;
        });

        return html.join("");
    }

    changeStatus(orders) {

        this.orderBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("status")) {
                e.preventDefault();
                if (!e.target.classList.contains("new")) return

                let id = +e.target.dataset.id;
                let current = orders.find(order => order.id == id);
                current.status = "completed";
                this.local.changeOrderStatus(current, () => {
                    e.target.classList.remove("new");
                    e.target.classList.add("success")
                    this.notify.showNotification(this.orderBody, "notification", "Order status changed to \"Completed\"");
                    this.showOrders(orders);
                });
            }

        })
    }

    generateModal(orders) {
        let html = orders.map((purchase, index) => {

            return `<div class="modal modal-2 fade" id="viewModal${index+1}" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="row">
                                    <div class="col-md-3">
                                        ${this.renderTotal(purchase.order)}
                                    </div>
                                        <div class="col-md-9">
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

    renderTotal(products) {
        let amount = products.reduce((prev, currnet) => (prev + Number(currnet.total)), 0);
        let count = products.reduce((prev, currnet) => (prev + Number(currnet.count)), 0);
        return `
        <div class="grand-totall">
            <div class="title-wrap">
                <h4 class="cart-bottom-title section-bg-gary-cart">Cart Total</h4>
            </div>
            <h5>Items <span>${count}</span></h5>
            <h5>Total price <span>$${amount}</span></h5>
        </div>
        `
    }

    showUsers(users) {
        let html = users.map((user, index) => {
            return `<tr>
                        <td>${index+1}</td>
                        <td>${user.login}</td>
                        <td>${user.pas}</td>
                        <td><a href="#">Change</a></td>
                        <td><a href="#">Delete</a></td>
                    </tr>`
        })

        this.usersBody.innerHTML = html.join("");
        
    }

    showProducts(products) {
        let html = products.map((product, index) => {
            return `<tr>
                        <td>${index+1}</td>
                        <td><img src="${product.thumbnail}" alt="img"></td>
                        <td>${product.brand}</td>
                        <td>${product.category}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td><a href="#">Change</a></td>
                        <td><a href="#">Delete</a></td>
                    </tr>`
        })

        this.productsBody.innerHTML = html.join("");
    }
}