import { Auth } from "./auth.js";
import { ShopDB } from "./model.js";
import { Register } from "./register.js";
import { Product } from "./product.js"
import { ProductCard, ProductCategory } from "./components.js"
import { Basket } from "./basket.js";

// const url = "";


new ShopDB().openDB();

new Auth();

new Register();

new Product().initTable();
new Basket()
getComponent("index.html", ProductCard, ["getCard",]);
getComponent("shop.html", ProductCard, ["getCard",]);
getComponent("shop.html", ProductCategory, ["getCategory",]);


function getComponent(url, Component, methods) {
  
    if (window.location.href.includes(url)) {
        let newComponent = new Component();
        methods.forEach(method => {
            newComponent[method]();
        });
    }
}

