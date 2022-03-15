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
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('users')
                .objectStore("users")
                .getAll();

            transaction.onsuccess = () => {
                resolve(transaction.result);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    addUser(user, onsuccess) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('users', 'readwrite')
                .objectStore("users")
                .add(user);

            transaction.onsuccess = () => {
                onsuccess();
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    getBaskets() {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('baskets')
                .objectStore("baskets")
                .getAll();

            transaction.onsuccess = () => {
                resolve(transaction.result);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }
    addBasket(basket) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('baskets', 'readwrite')
                .objectStore("baskets")
                .add(basket);

            transaction.onsuccess = () => {
                resolve(this);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    changeBasket(basket, onsuccess = null) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('baskets', 'readwrite')
                .objectStore("baskets")
                .put(basket);

            transaction.onsuccess = () => {
                if (onsuccess) onsuccess();
                resolve(this);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    addProduct(product) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('products', 'readwrite')
                .objectStore("products")
                .add(product);

            transaction.onsuccess = () => {
                resolve(this);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('products')
                .objectStore("products")
                .getAll();

            transaction.onsuccess = () => {
                resolve(transaction.result);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    getOrders() {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('orders')
                .objectStore("orders")
                .getAll();

            transaction.onsuccess = () => {
                resolve(transaction.result);
            }
            transaction.onerror = () => {
                reject("error");
            }
        })
    }

    addOrder(order, onsuccess = null) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction('orders', 'readwrite')
                .objectStore("orders")
                .add(order);

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