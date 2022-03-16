const contacts = [{
        id: 1,
        login: "admin",
        pas: "123",
        role: "admin"
    },
    {
        id: 2,
        login: "alex",
        pas: "123",
        role: "user"
    },
    {
        id: 3,
        login: "dima",
        pas: "123",
        role: "user"
    },
];


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
        if (LocalDB.exist) {
            return LocalDB.instance
        }
        LocalDB.instance = this;
        LocalDB.exist = true;

    }

    init() {
        return new Promise((resolve, reject) => {
            this.db = null;
            if (!('indexedDB' in window)) reject('not supported');

            const dbOpen = indexedDB.open("shop", 1);

            dbOpen.onupgradeneeded = e => {
                this.db = dbOpen.result;

                this.creatTables("users", contacts);
                this.creatTables("products", []);
                this.creatTables("baskets", []);
                this.creatTables("orders", []);
                resolve(this);
            };

            dbOpen.onsuccess = () => {
                this.db = dbOpen.result;
                resolve(this);
            };

            dbOpen.onerror = e => {
                reject(`IndexedDB error: ${ e.target.errorCode }`);
            };

        });
    }

    creatTables(key, arr) {
        let objectStore = this.db.createObjectStore(key, {
            keyPath: 'id',
            autoIncrement: true,
        });

        for (let i in arr) {
            objectStore.add(arr[i]);
        }
    }

    getUsers() {
        return this.getTable("users");
    }

    addUser(user, onsuccess = null) {
        return this.addItem("users", user, onsuccess);
    }

    getBaskets() {
        return this.getTable("baskets");
    }
    addBasket(basket, onsuccess = null) {
        return this.addItem("baskets", basket, onsuccess);
    }

    changeBasket(basket, onsuccess = null) {
        return this.changeItem("baskets", basket, onsuccess)
    }

    addProduct(product, onsuccess = null) {
        return this.addItem("products", product, onsuccess);
    }

    getProducts() {
        return this.getTable("products");
    }

    getOrders() {
        return this.getTable("orders");
    }

    addOrder(order, onsuccess = null) {
        return this.addItem("orders", order, onsuccess);
    }

    changeOrderStatus(order, onsuccess = null) {
        return this.changeItem("orders", order, onsuccess)
    }

    getTable(tableName) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(tableName)
                .objectStore(tableName)
                .getAll();

            transaction.onsuccess = () => {
                resolve(transaction.result);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    addItem(tableName, item, onsuccess) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(tableName, 'readwrite')
                .objectStore(tableName)
                .add(item);

            transaction.onsuccess = () => {
                if (onsuccess) onsuccess();
                resolve(this);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    changeItem(tableName, item, onsuccess) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(tableName, 'readwrite')
                .objectStore(tableName)
                .put(item);

            transaction.onsuccess = () => {
                if (onsuccess) onsuccess();
                resolve(this);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }


}