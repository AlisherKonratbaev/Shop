import { Auth } from "./auth.js";
import { ShopDB } from "./model.js";
import { Register } from "./register.js";
// const url = "https://fakestoreapi.com/products";


new ShopDB().openDB();
new Auth();
new Register();