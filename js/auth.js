import { LocalDB } from "./model.js"
import { Notify } from "./notify.js";



export class Auth {
    constructor() {

        if (!this.verify()) {
            return
        }
        this.connect();

        this.initDom();
        this.login();
        
    }

    verify() {
        this.logout();
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
        this.local = new LocalDB();
        this.notify = new Notify();
    }

    login() {
        this.loginBtn.addEventListener("click",  async (e) => {
            e.preventDefault();
            let users = await this.local.getUsers();
            this.check(users);
        })
    }

    check(users) {
        let login = this.loginEl.value.trim();
        let pas = this.pasEl.value.trim();

        let auth = {
            login,
            pas
        }

        let flag = false;

        users.forEach(item => {
            if (item.login === auth.login && item.pas === auth.pas) {
                flag = true;
                sessionStorage.setItem('authorizedUser', JSON.stringify({
                    login
                }));

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 100);
            }
        });

        if (!flag) {
            this.notify.showMessage(this.pasEl, "messege", "Неверный логин или пароль");
        }
    }

    logout() {
        const logoutBtn = document.querySelector("#logout");

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("authorizedUser");
        })
    }
}