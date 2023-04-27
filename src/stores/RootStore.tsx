import {action, computed, observable} from "mobx";
import WalletStore from './WalletStore'
import TransactionsStore from "./TransactionsStore"
import UIStore from "./UIStore";
import React from "react";
import {Period} from "./models/Period";
import PeriodStore from "./PeriodStore";
import Wallet from "./models/Wallet";
import {IGetDataResponse, IPeriod} from "../global";

//TODO tags
//TODO user settings (auto focus transaction value)

export interface RootStoreProp{
	RootStore?: RootStore
}

class RootStore {
	constructor() {
		this.WalletStore = new WalletStore(this);
		this.TransactionsStore = new TransactionsStore(this);
		this.UIStore = new UIStore(this);
		this.PeriodStore = new PeriodStore(this);
	}

	WalletStore: WalletStore;
	TransactionsStore: TransactionsStore;
	UIStore: UIStore;
	PeriodStore: PeriodStore;

	@observable url = (process.env.NODE_ENV === 'development') ?
		'http://localhost/back/api.php' :
		'../kb_back_service/api.php';
	@observable appData: any = {};
	@observable balances: Record<string, number> | undefined;
	@observable auth = true;
	@observable currDate = (process.env.NODE_ENV === 'development') ? new Date() : new Date();
	@observable dataLoaded = false;
	@observable isFetchingProp: boolean = false;
	@observable isNormalFetchTimePassed: boolean = true;
	normalFetchTime: number = 500;

	setAppData(appData: object) {
		this.appData = appData;
	}

	objToGet = (get_data: any): string => {
		let getArr = [];
		let get = "";
		if (Object.keys(get_data).length) {
			for (let key in get_data) {
				if (get_data.hasOwnProperty(key)) getArr.push(key + '=' + get_data[key]);
			}
			get = '?' + getArr.join('&');
		}
		return get;
	};


	doAjax = (data: any = {}, options: any = {}) => {

		if (process.env.NODE_ENV === "production") options.credentials = 'include';
		const requestUrl = this.url + this.objToGet(data);

		this.isFetchingProp = true;

		return fetch(requestUrl, options).then(res => {
			this.isFetchingProp = false;
			if (res.status === 401) this.setAuth(false);
			return res;
		});
	};

	@action.bound fetchData() {
		const date_str = this.getCurrDate;
		let get = {
			method: 'data_get',
			date: date_str,
		};

		this.isFetchingProp = true;
		this.isNormalFetchTimePassed = false;

		//задержка загрузочного спинера чтобы он не убирался слишком быстро
		setTimeout(() => {
			this.isNormalFetchTimePassed = true;
		}, this.normalFetchTime);

		this.doAjax(get).then(res => {
			if (res.status === 401) {
				this.auth = false;
				this.dataLoaded = true;
			}
			return res.json()
		})
			.then((res: IGetDataResponse) => {
				if (res.ok) {
					const ans = res.ans;
					this.setAppData(ans);

					this.balances = ans.balances;

						this.WalletStore.wallets = ans.wallets.map((wallet) => {
							const foundWallet = this.WalletStore.getWallet(wallet.id);
							if(foundWallet){
								foundWallet.copy(wallet);
								return foundWallet;
							}
							return new Wallet(wallet);
						});
						this.TransactionsStore.transactions = ans.transactions;
						this.TransactionsStore.categories = ans.categories;
						this.TransactionsStore.types = ans.transaction_types;

					if(this.WalletStore.wallets.length) {
						this.UIStore.TransactionsUI.selectedWallet = this.WalletStore.wallets[0];
					}
					if (ans.wallets.length > 1) this.UIStore.TransactionsUI.selectedToWallet = ans.wallets[1].id;

					this.PeriodStore.periods = ans.periods.map((p)=>{
						const period: IPeriod = {
							id: p.id,
							startDate: new Date(p.start_date),
							endDate: new Date(p.end_date),
							initStore: p.init_store,
							walletsInited: p.wallets_inited.map(item=>{return {
								wallet: this.WalletStore.getWallet(item.id),
								sum: item.sum,
								isAddToBalance: Boolean(item.is_add_to_balance)
							}})
						};
						return new Period(period);
					});

					this.dataLoaded = true;
					this.auth = true;
				}
			}).finally(() => {
			this.isFetchingProp = false
		});
	};

	@computed get isFetching() {
		return this.isFetchingProp || !this.isNormalFetchTimePassed
	}

	@action setAuth(val: boolean): void {
		this.auth = val;
	}

	@computed get getCurrDate() {
		let currDate = this.currDate;
		return [
			currDate.getFullYear(),
			(currDate.getMonth() + 1).toString().padStart(2, '0'),
			currDate.getDate().toString().padStart(2, '0')
		].join('-');
	};

	@action.bound currDateChange(val: number) {
		this.currDate = new Date(this.currDate.setDate(this.currDate.getDate() + val));
		this.fetchData();
	};

	@action.bound setCurrDateToday() {
		this.currDate = new Date();
		this.fetchData();
	}

	dateHuman(date?: string|Date) {
		const currDate = (date) ? new Date(date) : this.currDate;
		const months = ['января', 'феваля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сенября', 'октября', 'ноября', 'декабря'];
		const dateObj = new Date(currDate);
		return dateObj.getDate() + ' ' + months[dateObj.getMonth()]
	};

	dateStr(date?: string|Date){
		const currDate = (date) ? new Date(date) : this.currDate;
		return [
			currDate.getFullYear(),
			(currDate.getMonth()+1).toString().padStart(2,'0'),
			currDate.getDate().toString().padStart(2,'0')
		].join('-')
	};

	@computed get isAllBalancesNull(){
		if(!this.balances) return true;
		return Object.values(this.balances).every(b=>b === null);
	}

	changeWalletInit = (e: any) => {
		const wallet_id = e.target.dataset.wallet_id;
		const val = e.target.value;
		const get = {
			method: 'wallet_init',
			wallet_id,
			value: val,
			date: this.getCurrDate
		};
		this.doAjax(get).then(x => x.json()).then(res => {
			if (res.ok) {
				this.fetchData();
			}
		})
	};

	changeStartDay = (e: any) => {
		let val = e.target.value;
		const get = {
			method: 'change_start_day',
			date: this.getCurrDate,
			val
		};
		this.doAjax(get).then(x => x.json()).then(res => {
			if (res.ok) this.fetchData();
		});
	};

	delTransaction = (id: number) => {
		let get = {
			method: 'transaction_del',
			id
		};
		this.doAjax(get).then(x => x.json()).then(res => {
			if (res.ok) this.fetchData();
		})
	};

	@action.bound logout = () => {
		const get = {
			method: 'log_out'
		};
		this.doAjax(get).then(() => {
				this.auth = false;
			}
		)
	};

	dateDiffHuman = (date: string) => {
		const inp_date = new Date(date);
		const today = new Date();
		const dateDiff = Math.ceil((inp_date.getTime() - today.getTime()) / (3600 * 24 * 1000));
		const futureDays = [(<b>Сегодня</b>), 'Завтра', 'Послезавтра'];
		const pastDays = ['Вчера', 'Позавчера'];
		if (dateDiff >= 0 && dateDiff < 3) return futureDays[dateDiff];
		if (dateDiff >= 3) return dateDiff + ' дня';
		if (dateDiff < 0 && dateDiff > -3) return pastDays[-dateDiff - 1];
		return -dateDiff + ' назад'
	}; //человекочитаемая разница в днях

	getColor = (val: number) => {
		if (Math.abs(val) > 1000) val = 1000 * Math.sign(val);
		val = val / 1000;
		let red = 0;
		let green = 0;
		const initGreen = 210;
		if (val > 0) {
			red = 255 * (1 - val);
			green = initGreen;
		} else {
			red = 255;
			green = initGreen * (1 + val);
		}
		return 'rgb(' + red + ',' + green + ',0)';
	};
}

export default RootStore;
