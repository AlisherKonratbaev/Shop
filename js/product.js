import {
    LocalDB,
    Data
} from "./model.js";

const url = "https://dummyjson.com/products?limit=40";

export class Product {

    constructor() {
        this.localDB = new LocalDB();
        this.api = new Data();
    }

    initTable = async () => {
        let res = await this.api.loadData(url);
        let myProducts = res.products.map(product => {
            return {
                id: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category,
                description: product.description,
                images: product.images,
                price: product.price,
                rating: product.rating,
                thumbnail: product.thumbnail,
            }
        })

        let products = await this.localDB.getProducts();

        if (products.length == 0) {
            myProducts.forEach(product => {
                this.localDB.addProduct(product);
            })
        }

    }
    

}