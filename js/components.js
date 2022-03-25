import {
    LocalDB
} from "./model.js";

export class ProductCard {
    constructor() {
        this.connect();
        this.initDOM()
    }

    initDOM() {
        this.wrap = document.querySelector(".main_card");
    }
    connect() {
        this.local = new LocalDB();
    }

    getCard = async () => {
        await this.local.init();
        let products = await this.local.getProducts();
        this.showCards(products);
    }

    showCards(products) {
        let cards = this.generateCards(products);
        this.wrap.innerHTML = cards;
    }


    generateCards(products) {

        const html = products.map(product => {
            return `
                <div class="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-xs-6 mb-30px product-wrap show">
                    <div class="product" data-category="${product.category}" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
                        <div class="thumb">
                            <a href="single-product.html" class="image">
                                <img src="${product.thumbnail}" alt="Product" />
                                <img class="hover-image" src="${product.thumbnail}"
                                    alt="Product" />
                            </a>
                            <div class="actions">
                                <a href="wishlist.html" class="action wishlist" title="Wishlist"><i
                                        class="pe-7s-like"></i></a>
                                <a href="#" class="action quickview" data-link-action="quickview"
                                    title="Quick view" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"><i class="pe-7s-look"></i></a>

                            </div>
                        </div>
                        <div class="content">
                            <span class="ratings">
                                <span class="rating-wrap">
                                    <span class="star" style="width: 100%"></span>
                                </span>
                                <span class="rating-num">( 5 Review )</span>
                            </span>
                            <h5 class="title" ><a href="#">${product.title}
                                </a>
                            </h5>
                            <span class="price">
                                <span class="new">$${product.price}</span>
                            </span>
                        </div>
                        <button title="Add To Cart" class=" add-to-cart">Add
                            To Cart</button>
                    </div>
                </div>`
        })

        return html.join("");
    }

}

export class ProductCategory {
    constructor() {
        this.connect();
        this.initDOM();
    }

    initDOM() {
        this.wrap = document.querySelector(".sidebar-widget-category");
    }
    connect() {
        this.local = new LocalDB();
    }

    getCategory = async () => {
        await this.local.init();
        let products = await this.local.getProducts();
        let categoryHtml = this.renderHtml(products)
        this.wrap.innerHTML = categoryHtml;
    }

    renderHtml(products) {
        let allCategories = products.map(product => product.category);
        let categories = this.unique(allCategories);

        let html = categories.map(category => {
            let count = allCategories.filter(item => item == category).length;
            return `<li>
                        <a href="#" class="category-item" data-action="${category}"><i class="fa fa-angle-right"></i> ${category} <span>(${count})</span></a>
                    </li>`;
        });


        return `<ul>
                    <li>
                        <a href="#" class="category-item" data-action="all"><i class="fa fa-angle-right"></i> All <span>(${allCategories.length})</span></a>
                    </li> 
                    ${html.join("")}
                </ul>`
    }

    unique(arr) {
        return Array.from(new Set(arr));
    }
}

export class FilterCategory {

    constructor() {
        this.initDOM();
    }

    initDOM() {
        this.categoryWidget = document.querySelector(".sidebar-widget-category");
    }

    action() {
        this.categoryWidget.addEventListener("click", (e) => {
            if (!e.target.classList.contains("category-item")) return
            e.preventDefault();
            let category = e.target.dataset.action;
            let productsEl = document.querySelectorAll(".product");
            productsEl.forEach(el => {
                if (el.dataset.category == category) {
                    el.parentElement.classList.add("show");
                    el.parentElement.classList.remove("hide");
                } else if (category == "all") {
                    el.parentElement.classList.add("show");
                    el.parentElement.classList.remove("hide");
                } else {
                    el.parentElement.classList.add("hide");
                    el.parentElement.classList.remove("show");
                }
            })
        })
    }
}

export class FilterPrice {
    constructor() {
        this.connect();
        this.initDOM();
        this.showPrice();
    }

    initDOM() {
        this.priceWidget = document.querySelector(".price-filter");
        

    }
    connect() {
        this.local = new LocalDB();
    }

    showPrice = async () => {
        await this.local.init()
        let products = await this.local.getProducts();

        let prices = products.map(product => product.price);
        
        let min = Math.min(...prices);
        let max = Math.max(...prices);
        const amountEl = this.priceWidget.querySelector("#amount");
       
        
    }

    action() {

    }
}

