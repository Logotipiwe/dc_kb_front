import UIStore from "../UIStore";
import {makeAutoObservable} from "mobx";
import {ChangeEvent} from "react";
import {Period} from "../models/Period";
import Wallet from "../models/Wallet";
import {
    ICategory,
    INewPeriodWallet,
    IPeriodWallet,
    IWallet,
    Nullable,
    WalletPageModals,
    WalletsActivePanels
} from "../../global";
import autoBind from "../../utils/autoBind";


class WalletsUI {
    constructor(UIStore: UIStore) {
        makeAutoObservable(this)
        autoBind(this)
        this.UIStore = UIStore;
    }

    UIStore: UIStore;

    isDev = process.env.NODE_ENV === "development"

    activeModal: Nullable<WalletPageModals> = null;
    inputWalletTitle: string = '';
    deletingWallet: Nullable<IWallet> = null;
    showErr = false;

    activePanel: WalletsActivePanels = "1";
    periodSelected?: Period;
    isDeletingPeriod: boolean = (this.isDev) ? false : false;

    newPeriodStartDate?: string;
    newPeriodEndDate?: string;

    newPeriodInitStore: number = 0;

    newPeriodWallets: IPeriodWallet[] = [];
    newLimits: NewLimit[] = [{amount: 1}];
    limitToSelectCategoryFor?: NewLimit;

    static get defaultNewPeriodWalletsObj(): INewPeriodWallet {
        return {
            wallet: null,
            sum: NaN
        };
    };

    editingPeriod: Nullable<any>;

    get newPeriodWalletsSum() {
        const selectedSum = this.newPeriodWallets.reduce((sum, wallet) => {
            return sum + wallet.sum;
        }, 0);

        const unselectedSum = this.newPeriodUnselectedWallets.reduce((s, w) => ((w.value) ? (s + w.value) : s), 0);

        return selectedSum + unselectedSum;
    }
    get newPeriodSelectedWallets(): Array<Wallet> {
        const {walletStore: WalletsStore} = this.UIStore.rootStore;
        return WalletsStore.wallets.filter(w => this.newPeriodWallets.map(pw => pw.wallet).includes(w));
    }
    get newPeriodUnselectedWallets(): Wallet[] {
        const {walletStore: WalletsStore} = this.UIStore.rootStore;
        return WalletsStore.wallets.filter(w => !this.newPeriodSelectedWallets.includes(w))
    }
    get newPeriodMinAvailableDate(): string {
        if (!this.newPeriodStartDate) return '2020-01-01';
        const date = new Date(this.newPeriodStartDate);
        const minDate = new Date(date.getTime() + 1000 * 3600 * 24);
        return this.UIStore.rootStore.dateStr(minDate);
    }
    get newPeriodMaxAvailableDate(): string {
        if (!this.newPeriodEndDate) return '2040-01-01';
        const date = new Date(this.newPeriodEndDate);
        const minDate = new Date(date.getTime() - 1000 * 3600 * 24);
        return this.UIStore.rootStore.dateStr(minDate);
    }

    get daysCount(): number|undefined {
        if (!this.newPeriodStartDate || !this.newPeriodEndDate) return undefined;
        const start = new Date(this.newPeriodStartDate);
        const end = new Date(this.newPeriodEndDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
        const daysCount = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
        return daysCount;
    }

    get newPeriodPerDay(): number | undefined {
        const sum = this.newPeriodWalletsSum;
        const daysCount = this.daysCount
        if (!daysCount || daysCount < 1) return undefined;
        return Math.round((sum - this.newPeriodInitStore - this.limitsSum) / daysCount);
    }
    get limitsSum(): number {
        let sum = 0;
        this.newLimits.forEach(l=> sum+=l.amount);
        return sum;
    }
    setIsDeletingPeriod(val: boolean) {
        this.isDeletingPeriod = val;
    }
    setNewPeriodInitStore(val: number) {
        this.newPeriodInitStore = val || 0;
    }
    periodEdit(period: Period) {
        const RootStore = this.UIStore.rootStore;
        const data: any = {
            method: 'period_edit',
            id: period.id,
            init_store: period.UI.initStore,
            start_date: RootStore.dateStr(period.UI.startDate),
            end_date: RootStore.dateStr(period.UI.endDate),
            wallets: period.validNewPeriodWallets.map(i=>({id: i.wallet.id, sum: i.sum, is_add_to_balance: i.isAddToBalance ? 1 : 0}))
        };
        this.UIStore.rootStore.doAjax({}, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            if (res.ok) {
                this.activePanel = "1";
                setTimeout(this.UIStore.rootStore.fetchData);
            }
        })
    }
    periodDelete(period: Period) {
        const get = {
            method: 'period_del',
            period_id: period.id
        };
        this.UIStore.rootStore.doAjax(get).then(res => res.json()).then(res => {
            if (res.ok) {
                this.activePanel = "1";
                this.UIStore.rootStore.fetchData();
            }
        })
    }
    onNewPeriodModalClose() {
        // this.newPeriodWallets = WalletsUI.defaultNewPeriodWalletsObj;
        this.setActiveModal(null);
    }
    setActivePanel(id: WalletsActivePanels) {
        this.activePanel = id;
    }
    get validNewPeriodWallets() {
        return this.newPeriodWallets.filter(item =>
            item.wallet && !isNaN(item.sum)
        )
    }
    setNewPeriodFullMonth() {
        const {walletsUI, rootStore} = this.UIStore;
        const currMonth = rootStore.currDate.getMonth();
        const startDate = new Date(rootStore.currDate.getFullYear(), currMonth, 1);
        const endDate = new Date(rootStore.currDate.getFullYear(), currMonth + 1, 0);

        walletsUI.newPeriodStartDate = [
            startDate.getFullYear(),
            (startDate.getMonth() + 1).toString().padStart(2, '0'),
            (startDate.getDate()).toString().padStart(2, '0')
        ].join('-');
        walletsUI.newPeriodEndDate = [
            endDate.getFullYear(),
            (endDate.getMonth() + 1).toString().padStart(2, '0'),
            endDate.getDate().toString().padStart(2, '0')
        ].join('-');
    }
    inputNewPeriodStartDate(e: ChangeEvent<HTMLInputElement>) {
        this.newPeriodStartDate = e.target.value;
    }
    inputNewPeriodEndDate(e: ChangeEvent<HTMLInputElement>) {
        this.newPeriodEndDate = e.target.value;
    }
    newPeriod() {
        const start_date = this.newPeriodStartDate;
        const end_date = this.newPeriodEndDate;
        const init_store = this.newPeriodInitStore || 0;

        const get: any = {
            start_date, end_date, init_store, method: 'period_new'
        };
        this.validNewPeriodWallets.forEach(item => {
            const walletKey = "wallets[" + item.wallet!.id + "]";
            get[walletKey] = JSON.stringify({sum: item.sum, is_add_to_balance: item.isAddToBalance})
        });

        if (!start_date || !end_date) return this.showFromErr();

        this.UIStore.rootStore.doAjax(get).then(res => res.json()).then(res => {
            if (!res.ok) return this.showFromErr();

            this.setActiveModal(null);
            this.UIStore.rootStore.fetchData();
        });
    }
    periodClick(id: number) {
        this.periodSelected = this.UIStore.rootStore.periodStore.getPeriod(id);
        this.activePanel = "period";
    }
    hideErrTimeout: Nullable<typeof setTimeout.prototype> = null;
    setActiveModal(val: Nullable<WalletPageModals>): void {
        this.activeModal = val;
    };
    showDelWalletConfirmation(wallet: IWallet) {
        this.deletingWallet = wallet;
        this.setActiveModal("delWallet");
    }
    changeInputWalletTitle(e: any): void {
        this.inputWalletTitle = e.target.value;
    };
    showFromErr() {
        this.showErr = true;
        this.hideErrTimeout = setTimeout(() => {
            this.showErr = false;
        }, 3000);
    }
    newWallet(): Promise<any> {
        const title = this.inputWalletTitle;
        const get = {
            method: 'wallet_new',
            title
        };
        return this.UIStore.rootStore.doAjax(get)
            .then((x: any) => x.json())
            .then((res: any) => {
                if (res.ok) {
                    this.setActiveModal(null);
                    this.inputWalletTitle = '';
                    this.UIStore.rootStore.fetchData();
                } else {
                    if (res.err === 'invalid') {
                        this.showFromErr();
                    }
                }
            })
    };

    addNewLimit(){
        this.newLimits.push({amount: 0})
    }

    removeNewLimit(limit: NewLimit){
        this.newLimits.splice(this.newLimits.indexOf(limit), 1);
    }

    setLimitForSelectCategory(limit?: NewLimit){
        this.limitToSelectCategoryFor = limit
    }

    selectCategoryForLimit(category?: ICategory){
        console.log("a", category)
        if (this.limitToSelectCategoryFor) {
            console.log("b", this.limitToSelectCategoryFor)
            this.limitToSelectCategoryFor.category = category;
        }
    }
}

export interface NewLimit {
    category?: ICategory
    amount: number
}

export default WalletsUI;
