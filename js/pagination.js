import {
    LocalDB
} from "./model.js";

export class Pagination {
    constructor() {
        this.connect();
        this.initDOM();
    }

    initDOM() {
        this.wrap = document.querySelector(".main_card");

        this.count = 12;
    }
    connect() {
        this.local = new LocalDB();
    }

    showPagination() {
        this.showLiks(this.count)
    }

    showLiks(count) {
        let interval =  setInterval(() => {
            let products = document.querySelectorAll(".product-wrap");
            if(products.length != 0) clearInterval(interval);

            
        }, 0);
    }
}