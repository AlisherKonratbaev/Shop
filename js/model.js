const contacts = [
    { login: "admin", pas: "123", role: "admin" },
    { login: "alex", pas: "123", role: "user" },
    { login: "dima", pas: "123", role: "user" },

];

const productUrl = "https://fakestoreapi.com/products";


export class ShopDB {
    constructor() {
        if (ShopDB.exist) {
            return ShopDB.instance;
        }
        ShopDB.instance = this;
        ShopDB.exist = true;
        this.products = new Data(productUrl);
       
    }
    openDB(fn, context) {
        let openRequest = indexedDB.open("shop", 1);

        openRequest.onupgradeneeded = async () => {
            let db = openRequest.result;
            let products = await this.products.loadData()
            this.creatTables("users", contacts, db)
            this.creatTables("products", products, db)
        };

        openRequest.onerror = () => {
            console.error("Error", openRequest.error);
        };

        openRequest.onsuccess = async () => {
            let db = openRequest.result;
            if (fn) fn.call(context, db);
        };
    }

    creatTables(key, arr, db) {
        let objectStore = db.createObjectStore(key, {
            keyPath: 'id',
            autoIncrement: true,
        });

        for (let i in arr) {
            objectStore.add(arr[i]);
        }

        objectStore.createIndex('login', 'login', {
            unique: true
        });
    }

}


class Data {

    constructor(url) {
        this.url = url
    }

    loadData = async () => {
        let data;
        try {
            const respons = await fetch(this.url);
            data = await respons.json();
        } catch (e) {
            data = [];
            console.log("error", e);
        }
        return data;
    }

}