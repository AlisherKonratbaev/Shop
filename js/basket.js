import { ShopDB } from "./model.js";


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

    }

    initDOM() {
        this.wrap = document.querySelector("#offcanvas-cart");
        this.body = this.wrap.querySelector(".body");
    }
    connect() {
        this.local = new ShopDB();
    }

    initBasket() {
        this.local.openDB(this.getUsers, this);
    }
    getUsers(db) {
        let transaction = db.transaction('users')
            .objectStore("users")
            .getAll();

        transaction.onsuccess = () => {
            let users = transaction.result
            
        }
        transaction.onerror = () => {
            throw Error("error");
        }
    }
    

    showBasket() {

    }
    creatProduct() {

    }
}