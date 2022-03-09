import { ShopDB } from "./model.js";

export class ProductCard {
    constructor() {
        this.connect();
        this.initDOM()
    }

    initDOM() {
        this.wrap = document.querySelector(".main_card");
    }
    connect() {
        this.local = new ShopDB();
    }

    getCard() {
        this.local.openDB(this.showCard, this);
    }

    showCard(db) {
        let transaction = db.transaction('products')
            .objectStore("products")
            .getAll();

        transaction.onsuccess = () => {
            let products = transaction.result
            let cards = this.generateCards(products);
            this.wrap.innerHTML = cards;

        }
        transaction.onerror = () => {
            throw Error("error");
        }
    }

    generateCards(products) {

        const html = products.map(product => {
            return `
                <div class="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-xs-6 mb-30px">
                    <div class="product">
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
                            <h5 class="title"><a href="#">${product.title}
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
        this.local = new ShopDB();
    }

    getCategory() {
        this.local.openDB(this.showCategory, this);
    }

    showCategory(db) {
        let transaction = db.transaction('products')
            .objectStore("products")
            .getAll();

        transaction.onsuccess = () => {
            let products = transaction.result;
            let categories = this.generateCategories(products);
            this.wrap.innerHTML = categories;
        }
        transaction.onerror = () => {
            throw Error("error");
        }
    }

    generateCategories(products) {
        let allCategories = products.map(product => product.category);
        let categories = this.unique(allCategories);

        let html = categories.map(category => {
            let count = allCategories.filter(item => item == category).length;
            return `<li>
                        <a href="#" class=""><i class="fa fa-angle-right"></i> ${category} <span>(${count})</span></a>
                    </li>`;
        });


        return `<ul>
                    <li>
                        <a href="#" class=""><i class="fa fa-angle-right"></i> All <span>(${allCategories.length})</span></a>
                    </li> 
                    ${html.join("")}
                </ul>`
    }

    unique(arr) {
        return Array.from(new Set(arr));
    }
}


