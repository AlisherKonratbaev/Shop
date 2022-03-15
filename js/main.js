import { Auth } from "./auth.js";
import { LocalDB } from "./model.js";
import { Register } from "./register.js";
import { Product } from "./product.js"
import { ProductCard, ProductCategory } from "./components.js"
import { Basket } from "./basket.js";
import { Order } from "./order.js";
import { User } from "./user.js";


let loccalDB = new LocalDB();
loccalDB.init();


new Auth();

new Register();

new Product().initTable();
new Basket().initBasket();
new Order();
new User();
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

