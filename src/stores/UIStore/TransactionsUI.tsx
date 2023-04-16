import {action, computed, observable} from "mobx";
import UIStore from "../UIStore";
import Wallet from "../models/Wallet";
import {ICategory, Nullable, TransModal, TransPopout, TransValueTypes} from "../../global";

export default class TransactionsUI {
	constructor(UIStore: UIStore) {
		this.UIStore = UIStore;
	}

	UIStore: UIStore;

	@observable popout: TransPopout = null;
	@observable activeModal: TransModal = (process.env.NODE_ENV === 'development') ? "newTrans" : null;
	@observable isShowErr: boolean = false;
	@observable inputValue: Nullable<number> = (process.env.NODE_ENV === 'development') ? 1500 : null;
	// @observable selectedWalletId: Nullable<number> = null;
	@observable selectedWallet: Nullable<Wallet> = null;
	@observable selectedToWallet: Nullable<number> = null;
	@observable isAddToBalance: boolean = true;
	@observable selectedType: number = (process.env.NODE_ENV === 'development') ? 1 : 1;
	@observable isNewValueAsInvest: boolean = false;
	@observable isUnnecessary: boolean = false;
	@observable selectedCategory?: ICategory;
	@observable selectedTransValueType: TransValueTypes = (process.env.NODE_ENV === 'development')
		? "transValue"
		: "transValue"; //ввод суммы транзакции или нового значения счета
	// @observable isValueFieldFocused = false;
	hideErrTimeout: Nullable<typeof setTimeout.prototype> = null;

	@action.bound selectTransValueType(newVal: TransValueTypes) {
		this.selectedType = this.UIStore.RootStore.TransactionsStore.types[0].id;
		this.selectedTransValueType = newVal;
	}

	@action.bound changeInputValue(e: any) {
		const oldTransValue = this.transactionValue;
		this.inputValue = (isNaN(parseInt(e.target.value))) ? null : parseInt(e.target.value);
		if(this.selectedTransValueType === "walletValue"){
			if((this.transactionValue > 0) !== (oldTransValue > 0)) this.selectedCategory = undefined;
			this.selectedType = (this.transactionValue > 0)
				? 3
				: (this.isNewValueAsInvest) ? 5 : 1;
		}
	};

	@computed get transactionValue() { //значение которое будет записано в транзакцию
		if (this.selectedTransValueType === "transValue") return (this.inputValue || 0);
		const wallet = this.selectedWallet || this.UIStore.RootStore.WalletStore.wallets[0];
		return (wallet && wallet.value)
			? (this.inputValue || 0) - wallet.value
			: 0;
	}

	@computed get transactionDiff() { //сколько отнимется или прибавится к счету в результате
		if(this.selectedTransValueType === "transValue"){
			if(![1,3].includes(this.selectedType)) return 0;
			return (this.selectedType === 1) ? -(this.inputValue || 0) : (this.inputValue || 0);
		}

		const wallet = this.selectedWallet || this.UIStore.RootStore.WalletStore.wallets[0];
		return (wallet && wallet.value)
			? (this.inputValue || 0) - wallet.value
			: 0;
	}

	@computed get selectedCatSubcats(): ICategory[]{
		const selected = this.selectedCategory;
		if(!selected) return [];
		return Object.values(this.UIStore.RootStore.TransactionsStore.categories).filter(c => c.parent === selected.id);
	}

	@action.bound changeType(e: any) {
		let id = parseInt(e.target.value);
		if (id === 2) {
			this.selectedToWallet = this.UIStore.RootStore.WalletStore.wallets[1].id;
		} else {
			this.selectedToWallet = null;
		}
		this.selectedType = id;
		this.selectedCategory = undefined;
	};

	@action.bound changeWalletId = (e: any) => {
		const {WalletStore} = this.UIStore.RootStore;
		const val = parseInt(e.target.value);

		this.selectedWallet = WalletStore.getWallet(val);
		if (val === this.selectedToWallet) {
			this.selectedToWallet = WalletStore.availableToWallets[0].id;
		}
	};

	@action.bound changeIsAddToBalance(e: any){
		this.isAddToBalance = !!(e.target.checked);
	};

	@action.bound changeIsNewValueAsInvest(e: any){
		const newVal = !!(e.target.checked);
		this.isNewValueAsInvest= newVal;
		if(newVal) this.selectedType = 5;
		else this.selectedType = 1;
	};

	@action.bound changeIsUnnecessary(e: any){
		this.isUnnecessary = !!(e.target.checked);
	}

	@action.bound changeWalletTo = (e: any) => {
		this.selectedToWallet = parseInt(e.target.value);
	};

	@action.bound selectCat(category_id?: number) {
		if(this.selectedCategory?.id === category_id){
			this.selectedCategory = undefined;
		} else {
			this.selectedCategory = category_id ? this.UIStore.RootStore.TransactionsStore.categories[category_id] : undefined;
		}
		if(!this.selectedCatSubcats.length){
			this.setPopout(null);
		}
	}

	@action.bound setPopout(val: TransPopout){
		this.popout = val;
	}

	@computed get isShowingRootCats(): boolean{
		const categories = Object.values(this.UIStore.RootStore.TransactionsStore.categories);
		let selectedCat = this.selectedCategory;
		if(!selectedCat) {
			return true;
		}
		return !categories.some(c=>c.parent === selectedCat!.id);
	}

	@action.bound setActiveModal(val: TransModal) {
		this.activeModal = val;
	};

	@action.bound openCatSelectPopout() {
		this.setPopout('selectCat');
	}

	@action.bound storeMoneyLeft(valueLeft: number) {
		this.setDefaults();
		this.setActiveModal("newTrans");
		this.inputValue = valueLeft;
		this.selectedType = 4;
	}

	@action.bound setDefaults() {
		this.activeModal = null;
		this.inputValue = null;
		this.selectedWallet = this.UIStore.RootStore.WalletStore.wallets[0];
		this.selectedToWallet = null;
		this.selectedType = 1;
		this.selectedCategory = undefined;
		this.selectedTransValueType = "transValue";
		this.isAddToBalance = true;
	}

	@action.bound showErr(err: any = 'invalid') {
		if (err === 'invalid') {
			this.isShowErr = true;
			this.hideErrTimeout = setTimeout(() => {
				this.isShowErr = false
			}, 3000)
		}
	}
}
