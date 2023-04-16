import {action, observable} from "mobx";
import {IWallet, Nullable} from "../../global";

export default class Wallet {
	constructor(wallet: IWallet) {
		this.id = wallet.id;
		this.title = wallet.title;
		this.value = wallet.value;
		this.init = wallet.init;
	}

	@observable id: number;
	@observable title: string;
	@observable value: Nullable<number>;
	@observable init: Nullable<number>;

	@action.bound copy(wallet: IWallet){
		this.title = wallet.title;
		this.value = wallet.value;
		this.init = wallet.init;
	}
}
