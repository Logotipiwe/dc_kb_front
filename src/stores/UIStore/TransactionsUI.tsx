import {action, computed, makeAutoObservable, observable} from "mobx";
import UIStore from "../UIStore";
import Wallet from "../models/Wallet";
import {ICategory, Nullable, TransModal, TransValueTypes} from "../../global";
import autoBind from "../../utils/autoBind";

export default class TransactionsUI {
	constructor(UIStore: UIStore) {
		makeAutoObservable(this)
		autoBind(this)
		this.UIStore = UIStore;
	}

	UIStore: UIStore;

	isDev: boolean = process.env.NODE_ENV === "development";

	activeModal: TransModal = this.isDev ? "newTrans" : null;
	isShowErr: boolean = false;
	inputValue: Nullable<number> = this.isDev ? 1500 : null;
	selectedWallet: Nullable<Wallet> = null;
	selectedToWallet: Nullable<number> = null;
	isAddToBalance: boolean = true;
	selectedType: number = this.isDev ? 1 : 1;
	isNewValueAsInvest: boolean = false;
	isUnnecessary: boolean = false;
	selectedCategory?: ICategory;
	selectedTransValueType: TransValueTypes = "transValue"; //ввод суммы транзакции или нового значения счета
	// isValueFieldFocused = false;
	hideErrTimeout: Nullable<typeof setTimeout.prototype> = null;

	selectTransValueType(newVal: TransValueTypes) {
		this.selectedType = this.UIStore.rootStore.transactionsStore.types[0].id;
		this.selectedTransValueType = newVal;
	}

	changeInputValue(e: any) {
		const oldTransValue = this.transactionValue;
		this.inputValue = (isNaN(parseInt(e.target.value))) ? null : parseInt(e.target.value);
		if(this.selectedTransValueType === "walletValue"){
			if((this.transactionValue > 0) !== (oldTransValue > 0)) this.selectedCategory = undefined;
			this.selectedType = (this.transactionValue > 0)
				? 3
				: (this.isNewValueAsInvest) ? 5 : 1;
		}
	};

	get transactionValue() { //значение которое будет записано в транзакцию
		if (this.selectedTransValueType === "transValue") return (this.inputValue || 0);
		const wallet = this.selectedWallet || this.UIStore.rootStore.walletStore.wallets[0];
		return (wallet && wallet.value)
			? (this.inputValue || 0) - wallet.value
			: 0;
	}

	get transactionDiff() { //сколько отнимется или прибавится к счету в результате
		if(this.selectedTransValueType === "transValue"){
			if(![1,3].includes(this.selectedType)) return 0;
			return (this.selectedType === 1) ? -(this.inputValue || 0) : (this.inputValue || 0);
		}

		const wallet = this.selectedWallet || this.UIStore.rootStore.walletStore.wallets[0];
		return (wallet && wallet.value)
			? (this.inputValue || 0) - wallet.value
			: 0;
	}

	get selectedCatSubcats(): ICategory[]{
		const selected = this.selectedCategory;
		if(!selected) return [];
		return Object.values(this.UIStore.rootStore.transactionsStore.categories).filter(c => c.parent === selected.id);
	}

	changeType(e: any) {
		let id = parseInt(e.target.value);
		if (id === 2) {
			this.selectedToWallet = this.UIStore.rootStore.walletStore.wallets[1].id;
		} else {
			this.selectedToWallet = null;
		}
		this.selectedType = id;
		this.selectedCategory = undefined;
	};

	changeWalletId = (e: any) => {
		const {walletStore} = this.UIStore.rootStore;
		const val = parseInt(e.target.value);

		this.selectedWallet = walletStore.getWallet(val);
		if (val === this.selectedToWallet) {
			this.selectedToWallet = walletStore.availableToWallets[0].id;
		}
	};

	changeIsAddToBalance(e: any){
		this.isAddToBalance = !!(e.target.checked);
	};

	changeIsNewValueAsInvest(e: any){
		const newVal = !!(e.target.checked);
		this.isNewValueAsInvest= newVal;
		if(newVal) this.selectedType = 5;
		else this.selectedType = 1;
	};

	changeIsUnnecessary(e: any){
		this.isUnnecessary = !!(e.target.checked);
	}

	changeWalletTo = (e: any) => {
		this.selectedToWallet = parseInt(e.target.value);
	};

	selectCat(cat?: ICategory) {
		this.selectedCategory = cat
	}

	setActiveModal(val: TransModal) {
		this.activeModal = val;
	};

	storeMoneyLeft(valueLeft: number) {
		this.setDefaults();
		this.setActiveModal("newTrans");
		this.inputValue = valueLeft;
		this.selectedType = 4;
	}

	setDefaults() {
		this.activeModal = null;
		this.inputValue = null;
		this.selectedWallet = this.UIStore.rootStore.walletStore.wallets[0];
		this.selectedToWallet = null;
		this.selectedType = 1;
		this.selectedCategory = undefined;
		this.selectedTransValueType = "transValue";
		this.isAddToBalance = true;
	}

	showErr(err: any = 'invalid') {
		if (err === 'invalid') {
			this.isShowErr = true;
			this.hideErrTimeout = setTimeout(() => {
				this.isShowErr = false
			}, 3000)
		}
	}
}
