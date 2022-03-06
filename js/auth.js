import { ShopDB, Notify } from "./model.js"



export class Auth {
    constructor() {

        if (!this.verify()) {
            return
        }
        this.initDom();
        this.connect();
        this.login();
    }

    verify() {
        if (!window.location.href.includes("login.html")) {
            return false;
        }
        return true;
    }

    initDom() {
        this.wrap = document.querySelector("#lg1");
        this.loginEl = this.wrap.querySelector(".user-name")
        this.pasEl = this.wrap.querySelector(".user-password");
        this.loginBtn = this.wrap.querySelector("#login");
    }
    connect() {
        this.local = new ShopDB();
        this.notify = new Notify();
    }

    login() {
        this.loginBtn.addEventListener("click", (e) => {
            e.preventDefault();

            this.local.openDB(this.getUsers, this);
        })
    }

    getUsers(db) {
        let transaction = db.transaction('users')
            .objectStore("users")
            .getAll();

        transaction.onsuccess = () => {
            this.check(transaction.result);
        }
        transaction.onerror = () => {
            throw Error("error");
        }

    }

    check(users) {
        let login = this.loginEl.value.trim();
        let pas = this.pasEl.value.trim();
        let auth = { login, pas }
        
        let flag = false;

        users.forEach(item => {
            if (item.login === auth.login && item.pas === auth.pas) {
                flag = true;
                sessionStorage.setItem('authorizedUser', JSON.stringify({login}));

                setTimeout(() =>{window.location.href = "index.html";}, 100);
            }
        });

        if(!flag) {
            this.notify.showMessage(this.pasEl, "messege", "Неверный логин или пароль");
        }
    }
}