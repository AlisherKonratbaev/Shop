import {
    LocalDB
} from "./model.js";

export class Pagination {
    constructor() {
        this.connect();
        this.initDOM();
        this.action();
        this.getActive(1);
        this.showItems(1);
    }

    initDOM() {
        this.wrap = document.querySelector(".main_card");
        this.current = 1;
        this.count = 12;
    }
    connect() {
        this.local = new LocalDB();
    }

    showPagination() {
        this.showLiks(this.count)
    }

    showLiks(count) {
        let interval = setInterval(() => {
            let products = document.querySelectorAll(".product-wrap");
            if (products.length != 0) {
                clearInterval(interval);
                const linkwrap = document.querySelector(".pages");

                let ulEl = this.getLiks(products, count);
                linkwrap.innerHTML = ulEl
            }

        }, 0);
    }
    getLiks(products, count) {
        let linkCount = Math.ceil(products.length / count)
        let liEls = '';
        for (let i = 1; i <= linkCount; i++) {
            liEls += `<li class="li"><a class="page-link" href="#" data-index="${i}">${i}</a></li>`;
        }

        return `<ul>
                    ${liEls}
                </ul>`;
    }

    action() {
        const linkwrap = document.querySelector(".pages");

        linkwrap.addEventListener("click", (e) => {
            if (!e.target.classList.contains("page-link")) return
            e.preventDefault();
            this.getActive(+e.target.dataset.index);
            this.showItems(+e.target.dataset.index);
        })
    }
    getActive(current) {
        let linkEls = document.querySelectorAll(".page-link");
        linkEls.forEach(link => {
            if (+link.dataset.index == current) link.classList.add("active");
            else link.classList.remove("active");
        })
    }
    showItems(current) {
        let products = document.querySelectorAll(".product-wrap");
        products.forEach((product, index) => {
            
            if(this.count * (current-1) <= index && index < this.count * current){
                product.classList.add("show")
                product.classList.remove("hide")
            } else {
                product.classList.add("hide")
                product.classList.remove("show")
            }
        })
    }
}