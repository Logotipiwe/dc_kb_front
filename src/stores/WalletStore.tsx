import {action, computed, observable} from "mobx";
import RootStore from "./RootStore";
import Wallet from "./models/Wallet";

export default class WalletStore {
	constructor(RootStore : RootStore) {
		this.RootStore = RootStore;
	}

	RootStore : RootStore;

	@observable wallets : Wallet[] = [];

	getWallet(id: number){
		return this.wallets.filter(wallet=>wallet.id===id)[0];
	}

	@computed get availableToWallets(){
		return this.wallets.filter(wallet=>(wallet !== this.RootStore.UIStore.TransactionsUI.selectedWallet))
	}

	@computed get walletsNotSelectedInNewPeriod(){
		return this.wallets.filter(w=>
			!this.RootStore.UIStore.WalletsUI.newPeriodWallets.some(p=>p.wallet === w)
		)
	}

	@action.bound initWallet(e : any){
		const wallet_id = e.target.dataset.wallet_id;
		const value = e.target.value;
		let get = {
			method: 'wallet_init',
			date: this.RootStore.getCurrDate,
			value,
			wallet_id
		};
		this.RootStore.doAjax(get).then(x => x.json()).then(res => {
			if (res.ok) {
				this.RootStore.fetchData()
			}
		})
	};

	@action.bound delWallet(wallet_id : number){
		this.RootStore.doAjax({method: 'wallet_del',wallet_id})
			.then(x=>x.json())
			.then(res=>{
				if(res.ok){
					this.RootStore.fetchData();
				}
				this.RootStore.UIStore.WalletsUI.setActiveModal(null);
			});
	}
}
