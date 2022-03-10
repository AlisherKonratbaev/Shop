const contacts = [{
        id:1,
        login: "admin",
        pas: "123",
        role: "admin"
    },
    {
        id:2,
        login: "alex",
        pas: "123",
        role: "user"
    },
    {
        id:3,
        login: "dima",
        pas: "123",
        role: "user"
    },
];


export class ShopDB {
    constructor() {
        if (ShopDB.exist) {
            return ShopDB.instance;
        }
        ShopDB.instance = this;
        ShopDB.exist = true;
        this.virtualDB = new VirtualDB();

    }
    openDB(fn, context) {
        let openRequest = indexedDB.open("shop", 1);

        openRequest.onupgradeneeded = () => {
            let db = openRequest.result;
            this.creatTables("users", contacts, db);
            contacts.forEach(contact => this.virtualDB.addUser(contact));
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


export class VirtualDB {
    constructor(){
        if(VirtualDB.exist) {
            return VirtualDB.instance
        }
        VirtualDB.instance = this
        VirtualDB.exist = true;

        this.init()
    }
    init() {
        this.users = [];
        this.basket = [];
        this.products = [];
    }
    
    addUser(user) {
        this.users.push(user)
    }
}