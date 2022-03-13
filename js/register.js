import {
    LocalDB
} from "./model.js";
import {
    Notify
} from "./notify.js";



export class Register {
    constructor() {

        if (!this.verify()) {
            return
        }
        this.initDom();
        this.connect();
        this.register();
    }

    verify() {
        if (!window.location.href.includes("login.html")) {
            return false;
        }
        return true;
    }

    initDom() {
        this.wrap = document.querySelector("#lg2");
        this.loginEl = this.wrap.querySelector(".user-name")
        this.pasEl = this.wrap.querySelector(".user-password");
        this.cpasEl = this.wrap.querySelector(".user-cpassword");
        this.registerBtn = this.wrap.querySelector("#register");

    }
    connect() {
        this.notify = new Notify();
        this.localDB = new LocalDB();
    }

    register() {
        this.registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            let users = await this.localDB.getUsers();
            let user = this.check(users);
            if (user) {
                this.localDB.addUser(user, this.onsuccess.bind(this))
            }
        })
    }


    check(users) {
        let login = this.loginEl.value.trim();
        let pas = this.pasEl.value.trim();
        let cpas = this.cpasEl.value.trim();

        if (pas !== cpas || pas == "") {
            this.notify.showMessage(this.pasEl, "message", "Пароли не совпадают");
            return;
        } else if (login == "") {
            this.notify.showMessage(this.loginEl, "message", "Необходимо заполнить логин");
            return;
        }

        let newUser = {
            login,
            pas,
            role: "user",
        }

        if (users.find(user => user.login === newUser.login)) {
            this.notify.showMessage(this.cpasEl, "message", "Логин уже существует!");
            return;
        }

        return newUser;
    }

    onsuccess() {
        this.notify.showNotification(this.loginEl, "notification", "Аккаунт успешно зарегистрирован");
        this.clearInputs();
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
    }

    clearInputs() {
        this.loginEl.value = "";
        this.pasEl.value = "";
        this.cpasEl.value = "";
    }
}