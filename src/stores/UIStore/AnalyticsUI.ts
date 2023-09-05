import UIStore from '../UIStore'
import {action, observable} from "mobx";
import Wallet from "../models/Wallet";
import {ICategory, Nullable} from "../../global";
import autoBind from "../../utils/autoBind";

export default class AnalyticsUI {
	constructor(UIStore : UIStore) {
		this.UIStore = UIStore;
		autoBind(this)
	}
	UIStore : UIStore;

	@observable selectedWallet: Nullable<Wallet> = null;
	@observable selectedCategory: Nullable<ICategory> = null;

	@action.bound selectCategory(category: ICategory){
		this.selectedCategory = category;
	}
}
