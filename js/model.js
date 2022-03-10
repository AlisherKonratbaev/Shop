

const contacts = [
    { login: "admin", pas: "123", role: "admin" },
    { login: "alex", pas: "123", role: "user" },
    { login: "dima", pas: "123", role: "user" },
];


export class ShopDB {
    constructor() {
        if (ShopDB.exist) {
            return ShopDB.instance;
        }
        ShopDB.instance = this;
        ShopDB.exist = true;

    }
    openDB(fn, context) {
        let openRequest = indexedDB.open("shop", 1);

        openRequest.onupgradeneeded = () => {
            let db = openRequest.result;
            this.creatTables("users", contacts, db);
            this.creatTables("products", [], db);
            this.creatTables("basket", [], db);
        };

        openRequest.onerror = () => {
            console.error("Error", openRequest.error);
        };

        openRequest.onsuccess = () => {
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
    }

}


export class Data {

    loadData = async function (url) {
        let data;
        try {
            const respons = await fetch(url);
            data = await respons.json();
        } catch (e) {
            data = [];
            console.log("error", e);
        }
        return data;
    }

}


export class LocalDB {

    constructor() {

    }


    getUser() {
        
    }

    
}

