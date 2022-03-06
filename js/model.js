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
        console.log(1);
    }
    openDB(fn, context) {
        let openRequest = indexedDB.open("shop", 1);

        openRequest.onupgradeneeded = () => {
            let db = openRequest.result;
            this.creatTables("users", contacts, db)
            console.log(db);
        };

        openRequest.onerror = () => {
            console.error("Error", openRequest.error);
        };

        openRequest.onsuccess = () => {
            let db = openRequest.result;
            if(fn) fn.call(context, db);
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


export class Notify {

    showNotification(element, className, text) {
        const message = document.createElement("p");
        message.classList.add(className);
        message.textContent = text;
        element.insertAdjacentElement("afterend", message);
        setTimeout(() => {
            message.style.right = "1px";
        }, 250);
        setTimeout(() => {
            message.style.right = "-175px";

            setTimeout(() => {
                message.remove();
            }, 500);

        }, 2000);

    }
    showMessage(element, className, text) {
        const message = document.createElement("p");
        message.classList.add(className);
        message.textContent = text;
        element.insertAdjacentElement("afterend", message);
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

} 