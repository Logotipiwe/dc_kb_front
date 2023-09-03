import {action, observable} from "mobx";
import UIStore from "../UIStore";
import {LoginView} from "../../global";
import autoBind from "../../utils/autoBind";

export default class LoginUI {
    constructor(UIStore: UIStore) {
        this.UIStore = UIStore;
        autoBind(this)
    }

    UIStore: UIStore;

    @observable activeView: LoginView = 'login';
    @observable inputLogin = '';
    @observable inputPassword = '';
    @observable inputLoginReg = '';
    @observable inputPasswordReg = '';

    @action.bound setInputLogin(e: any) {
        this.inputLogin = e.target.value;
    }

    @action.bound setInputPassword(e: any) {
        this.inputPassword = e.target.value;
    }

    @action.bound submitLogin() {
        const data = {
            method: 'sign_in',
            login: this.inputLogin,
            password: this.inputPassword,
        };
        this.UIStore.rootStore.doAjax(data).then((x: Response) => x.json()).then((res: Response) => {
            if (res.ok) {
                this.UIStore.rootStore.fetchData();
            }
        })
    }

    @action.bound setActiveView(val : LoginView) {
        this.activeView = val;
    }

    @action.bound setInputLoginReg(e : any) {
        this.inputLoginReg = e.target.value;
    }

    @action.bound setInputPasswordReg(e : any) {
        this.inputPasswordReg = e.target.value;
    }


    @action.bound submitReg = () => {
        const data = {
            method: 'sign_up',
            login: this.inputLoginReg,
            password: this.inputPasswordReg
        };
        this.UIStore.rootStore.doAjax(data).then((x: Response) => x.json()).then((res: Response) => {
            if (res.ok) {
                this.UIStore.rootStore.fetchData();
            }
        })
    };
}
