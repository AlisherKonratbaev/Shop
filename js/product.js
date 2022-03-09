import { ShopDB, Data } from "./model.js";

const url = "https://dummyjson.com/products?limit=40";

export class Product {

    constructor() {
        this.db = new ShopDB();
        this.api = new Data();
        
    }

    initTable() {
       
        this.db.openDB(this.creatTable, this)
    }

    creatTable = async (db) => {
        let res = await this.api.loadData(url);

        let myProducts = res.products.map(product => {
            return {
                id:product.id,
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

        myProducts.forEach(product => {
            this.addPorduct(product, db)
        });
    }

    addPorduct(product, db) {
        let transaction = db.transaction('products', 'readwrite')
            .objectStore("products")
            .add(product);

        transaction.onsuccess = () => {
            
        }
        transaction.onerror = () => {
            // throw Error("error");
        }
    }

}