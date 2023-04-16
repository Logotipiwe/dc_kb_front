import UIStore from "../UIStore";
import {action, computed, observable} from "mobx";
import {ChangeEvent} from "react";
import {Period} from "../models/Period";
import Wallet from "../models/Wallet";
import {
    INewPeriodWallet,
    IPeriodWallet,
    IWallet,
    Nullable,
    Undefindable,
    WalletPageModals,
    WalletsActivePanels
} from "../../global";


class WalletsUI {
    constructor(UIStore: UIStore) {
        this.UIStore = UIStore;
    }

    UIStore: UIStore;

    @observable activeModal: Nullable<WalletPageModals> =
        (process.env.NODE_ENV === "development") ? null : null;
    @observable inputWalletTitle: string = '';
    @observable deletingWallet: Nullable<IWallet> = null;
    @observable showErr = false;

    @observable activePanel: WalletsActivePanels = (process.env.NODE_ENV === "development") ? "1" : "1";
    @observable periodSelected: Undefindable<Period>;
    @observable isDeletingPeriod: boolean = (process.env.NODE_ENV === "development") ? false : false;

    @observable newPeriodStartDate: Undefindable<string> = (process.env.NODE_ENV === "development")
        // ? '2020-09-19'
        ? undefined
        : undefined;
    @observable newPeriodEndDate: Undefindable<string> = (process.env.NODE_ENV === "development")
        // ? '2020-09-23'
        ? undefined
        : undefined;

    @observable newPeriodInitStore: number = 0;

    @observable newPeriodWallets: IPeriodWallet[] = [];

    static get defaultNewPeriodWalletsObj(): INewPeriodWallet {
        return {
            wallet: null,
            sum: NaN
        };
    };

    @observable editingPeriod: Nullable<any>;

    @computed get newPeriodWalletsSum() {
        const selectedSum = this.newPeriodWallets.reduce((sum, wallet) => {
            return sum + wallet.sum;
        }, 0);

        const unselectedSum = this.newPeriodUnselectedWallets.reduce((s, w) => ((w.value) ? (s + w.value) : s), 0);

        return selectedSum + unselectedSum;
    }


    @computed get newPeriodSelectedWallets(): Array<Wallet> {
        const {WalletStore: WalletsStore} = this.UIStore.RootStore;
        return WalletsStore.wallets.filter(w => this.newPeriodWallets.map(pw => pw.wallet).includes(w));
    }

    @computed get newPeriodUnselectedWallets(): Wallet[] {
        const {WalletStore: WalletsStore} = this.UIStore.RootStore;
        return WalletsStore.wallets.filter(w => !this.newPeriodSelectedWallets.includes(w))
    }

    @computed get newPeriodMinAvailableDate(): string {
        if (!this.newPeriodStartDate) return '2020-01-01';
        const date = new Date(this.newPeriodStartDate);
        const minDate = new Date(date.getTime() + 1000 * 3600 * 24);
        return this.UIStore.RootStore.dateStr(minDate);
    }

    @computed get newPeriodMaxAvailableDate(): string {
        if (!this.newPeriodEndDate) return '2040-01-01';
        const date = new Date(this.newPeriodEndDate);
        const minDate = new Date(date.getTime() - 1000 * 3600 * 24);
        return this.UIStore.RootStore.dateStr(minDate);
    }

    @computed get newPeriodPerDay(): number | undefined {
        const sum = this.newPeriodWalletsSum;
        if (!this.newPeriodStartDate || !this.newPeriodEndDate) return undefined;
        const start = new Date(this.newPeriodStartDate);
        const end = new Date(this.newPeriodEndDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
        const daysCount = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
        if (daysCount < 1) return undefined;
        return Math.round((sum - this.newPeriodInitStore) / daysCount);
    }

    @action.bound setIsDeletingPeriod(val: boolean) {
        this.isDeletingPeriod = val;
    }

    @action.bound setNewPeriodInitStore(val: number) {
        this.newPeriodInitStore = val || 0;
    }

    @action.bound periodEdit(period: Period) {
        const RootStore = this.UIStore.RootStore;
        const data: any = {
            method: 'period_edit',
            id: period.id,
            init_store: period.UI.initStore,
            start_date: RootStore.dateStr(period.UI.startDate),
            end_date: RootStore.dateStr(period.UI.endDate),
            wallets: period.validNewPeriodWallets.map(i=>({id: i.wallet.id, sum: i.sum, is_add_to_balance: i.isAddToBalance ? 1 : 0}))
        };
        this.UIStore.RootStore.doAjax({}, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            if (res.ok) {
                this.activePanel = "1";
                setTimeout(this.UIStore.RootStore.fetchData);
            }
        })
    }

    @action.bound periodDelete(period: Period) {
        const get = {
            method: 'period_del',
            period_id: period.id
        };
        this.UIStore.RootStore.doAjax(get).then(res => res.json()).then(res => {
            if (res.ok) {
                this.activePanel = "1";
                this.UIStore.RootStore.fetchData();
            }
        })
    }

    @action.bound onNewPeriodModalClose() {
        // this.newPeriodWallets = WalletsUI.defaultNewPeriodWalletsObj;
        this.setActiveModal(null);
    }

    @action.bound setActivePanel(id: WalletsActivePanels) {
        this.activePanel = id;
    }

    @computed get validNewPeriodWallets() {
        return this.newPeriodWallets.filter(item =>
            item.wallet && !isNaN(item.sum)
        )
    }

    @action.bound setNewPeriodFullMonth() {
        const {WalletsUI, RootStore} = this.UIStore;
        const currMonth = RootStore.currDate.getMonth();
        const startDate = new Date(RootStore.currDate.getFullYear(), currMonth, 1);
        const endDate = new Date(RootStore.currDate.getFullYear(), currMonth + 1, 0);

        WalletsUI.newPeriodStartDate = [
            startDate.getFullYear(),
            (startDate.getMonth() + 1).toString().padStart(2, '0'),
            (startDate.getDate()).toString().padStart(2, '0')
        ].join('-');
        WalletsUI.newPeriodEndDate = [
            endDate.getFullYear(),
            (endDate.getMonth() + 1).toString().padStart(2, '0'),
            endDate.getDate().toString().padStart(2, '0')
        ].join('-');
    }

    @action.bound inputNewPeriodStartDate(e: ChangeEvent<HTMLInputElement>) {
        this.newPeriodStartDate = e.target.value;
    }

    @action.bound inputNewPeriodEndDate(e: ChangeEvent<HTMLInputElement>) {
        this.newPeriodEndDate = e.target.value;
    }

    @action.bound newPeriod() {
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

        this.UIStore.RootStore.doAjax(get).then(res => res.json()).then(res => {
            if (!res.ok) return this.showFromErr();

            this.setActiveModal(null);
            this.UIStore.RootStore.fetchData();
        });
    }

    @action.bound periodClick(id: number) {
        this.periodSelected = this.UIStore.RootStore.PeriodStore.getPeriod(id);
        this.activePanel = "period";
    }

    hideErrTimeout: Nullable<typeof setTimeout.prototype> = null;

    @action.bound setActiveModal(val: Nullable<WalletPageModals>): void {
        this.activeModal = val;
    };

    @action.bound showDelWalletConfirmation(wallet: IWallet) {
        this.deletingWallet = wallet;
        this.setActiveModal("delWallet");
    }

    @action.bound changeInputWalletTitle(e: any): void {
        this.inputWalletTitle = e.target.value;
    };

    @action.bound showFromErr() {
        this.showErr = true;
        this.hideErrTimeout = setTimeout(() => {
            this.showErr = false;
        }, 3000);
    }

    @action.bound newWallet(): Promise<any> {
        const title = this.inputWalletTitle;
        const get = {
            method: 'wallet_new',
            title
        };
        return this.UIStore.RootStore.doAjax(get)
            .then((x: any) => x.json())
            .then((res: any) => {
                if (res.ok) {
                    this.setActiveModal(null);
                    this.inputWalletTitle = '';
                    this.UIStore.RootStore.fetchData();
                } else {
                    if (res.err === 'invalid') {
                        this.showFromErr();
                    }
                }
            })
    };
}

export default WalletsUI;
