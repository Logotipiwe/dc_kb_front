import {action, computed, observable} from "mobx";
import RootStore from "./RootStore";
import {ICategory, ITransaction, IType} from "../global";

class TransactionsStore {
	constructor(RootStore : RootStore) {
		this.RootStore = RootStore;
	}

	RootStore : RootStore;

	@observable transactions : ITransaction[] = [];
	@observable categories : Record<any, ICategory> = {};
	@observable types : IType[] = [];

	getType(id: number){
		return this.types.filter(type=>type.id===id)[0];
	}

    @computed get categoriesToShow(): ICategory[] {
        let categories = Object.values(this.categories);
        const transactionsUI = this.RootStore.UIStore.TransactionsUI;
        if(transactionsUI.selectedCategory !== null){
			const subcats = transactionsUI.selectedCatSubcats;
			if(subcats.length) {
				return subcats;
			}
        }
        return categories.filter(category => category.types.includes(transactionsUI.selectedType));
    };

	@computed get availableTypes(){
		return this.types.filter(type=>{
			return !(this.RootStore.WalletStore.wallets.length < 2 && type.id===2)
		})
	}

	@action.bound newTrans() {
		const UIStore = this.RootStore.UIStore;
		const TransactionsUI = UIStore.TransactionsUI;
		const wallet = TransactionsUI.selectedWallet || this.RootStore.WalletStore.wallets[0];
		let type;
		const value = Math.abs(TransactionsUI.transactionValue);
		if (TransactionsUI.selectedTransValueType === "transValue") {
			type = TransactionsUI.selectedType;
		} else {
			const inputValue = TransactionsUI.inputValue;
			if (inputValue === null) return TransactionsUI.showErr();
			if(value === 0) return TransactionsUI.showErr();
			type = TransactionsUI.selectedType;
		}

		let category = TransactionsUI.selectedCategory
			? TransactionsUI.selectedCategory.id
			: null;

		const get : any = {
			method: 'transaction_new',
			value,
			type,
			is_unnecessary: TransactionsUI.isUnnecessary ? 1 : 0,
			wallet_id: wallet.id,
			category,
			date: this.RootStore.getCurrDate
		};
		if (TransactionsUI.selectedToWallet !== null && get.type === 2) {
			get.to_wallet = TransactionsUI.selectedToWallet;
		}
		if(type === 3){
			get.is_add_to_balance = Number(TransactionsUI.isAddToBalance);
		}

		return this.RootStore.doAjax(get).then(x => x.json()).then(res => {
			if (res.ok) {
				this.RootStore.fetchData();
				TransactionsUI.setDefaults();
			} else {
				TransactionsUI.showErr(res.err);
			}
			return res;
		});
	};
}

export default TransactionsStore
