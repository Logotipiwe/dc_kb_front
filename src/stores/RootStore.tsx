import {action, computed, makeAutoObservable, observable} from "mobx";
import WalletStore from './WalletStore'
import TransactionsStore from "./TransactionsStore"
import UIStore from "./UIStore";
import React from "react";
import {Period} from "./models/Period";
import PeriodStore from "./PeriodStore";
import Wallet from "./models/Wallet";
import {IGetData, IGetDataAnsResponse, IGetDataResponse, IPeriod, Limit} from "../global";
import autoBind from "../utils/autoBind";

export interface RootStoreProp{
	RootStore?: RootStore
}

class RootStore {
	constructor() {
		makeAutoObservable(this)
		autoBind(this)

		this.walletStore = new WalletStore(this);
		this.transactionsStore = new TransactionsStore(this);
		this.uiStore = new UIStore(this);
		this.periodStore = new PeriodStore(this);
	}

	walletStore: WalletStore;
	transactionsStore: TransactionsStore;
	uiStore: UIStore;
	periodStore: PeriodStore;

	isDev: boolean = process.env.NODE_ENV === "development";

	url = this.isDev ?
		'http://localhost/kb_back_service/api.php' :
		'../kb_back_service/api.php';
	appData?: IGetData;
	balances: Record<string, number> | undefined;
	auth = true;
	currDate = this.isDev ? new Date() : new Date();
	dataLoaded = false;
	isFetchingProp: boolean = false;
	isNormalFetchTimePassed: boolean = true;
	normalFetchTime: number = 500;

	setAppData(appData: IGetDataAnsResponse){

		this.appData = {
			...appData,
			limit_balances: this.processLimitBalances(appData.limit_balances)
		};
	}

	processLimitBalances(limit_balances: Record<string, Record<string, number> | null>) {
		const res: Record<string, Record<string, number>> = {}
		Object.entries(limit_balances).forEach(limitBalance=>{
			const date = limitBalance[0];
			if(limitBalance[1]) {
				Object.entries(limitBalance[1]).forEach(categoryToAmount=>{
					const categoryId = categoryToAmount[0]
					const amount = categoryToAmount[1]
					if(!res[categoryId]) res[categoryId] = {}
					res[categoryId]![date] = amount
				})
			}
		})
		return res;
	}

	objToGet = (get_data: any): string => {
		let getArr: string[] = [];
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

	fetchData() {
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

					this.walletStore.wallets = ans.wallets.map((wallet) => {
						const foundWallet = this.walletStore.getWallet(wallet.id);
						if(foundWallet){
							foundWallet.copy(wallet);
							return foundWallet;
						}
						return new Wallet(wallet);
					});
					this.transactionsStore.transactions = ans.transactions;
					this.transactionsStore.categories = ans.categories;
					this.transactionsStore.types = ans.transaction_types;

					const limits: Limit[] = ans.all_limits
						.filter(l=>ans.curr_period && ans.curr_period.id === l.period_id)
						.map(l=> ({...l, category: ans.categories[l.category_id]}))
					this.periodStore.limits = limits;
					this.uiStore.walletsUI.refreshLimitsUi();

					if(this.walletStore.wallets.length) {
						this.uiStore.transactionsUI.selectedWallet = this.walletStore.wallets[0];
					}
					if (ans.wallets.length > 1) this.uiStore.transactionsUI.selectedToWallet = ans.wallets[1].id;

					this.periodStore.periods = ans.periods.map((p)=>{
						const period: IPeriod = {
							id: p.id,
							startDate: new Date(p.start_date),
							endDate: new Date(p.end_date),
							initStore: p.init_store,
							walletsInited: p.wallets_inited.map(item=>{return {
								wallet: this.walletStore.getWallet(item.id),
								sum: item.sum,
								isAddToBalance: Boolean(item.is_add_to_balance)
							}})
						};
						return new Period(period);
					});

					this.dataLoaded = true;
					this.auth = true;

					if(this.isDev){
						const walletsUI = this.uiStore.walletsUI;
						// this.uiStore.activeStory = "wallets"
						// setTimeout(()=>walletsUI.periodClick(139),500)
						// walletsUI.activeModal = "newPeriod"
						// walletsUI.newPeriodStartDate = '2023-10-01'
						// walletsUI.newPeriodEndDate = '2023-10-30'
						// walletsUI.periodSelected = this.periodStore.getPeriod(134)
					}
				}
			})
			.finally(() => {
			this.isFetchingProp = false
		});
	};

	get isFetching() {
		return this.isFetchingProp || !this.isNormalFetchTimePassed
	}

	setAuth(val: boolean): void {
		this.auth = val;
	}

	get getCurrDate() {
		let currDate = this.currDate;
		return [
			currDate.getFullYear(),
			(currDate.getMonth() + 1).toString().padStart(2, '0'),
			currDate.getDate().toString().padStart(2, '0')
		].join('-');
	};

	currDateChange(val: number) {
		this.currDate = new Date(this.currDate.setDate(this.currDate.getDate() + val));
		this.fetchData();
	};

	setCurrDateToday() {
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

	get isAllBalancesNull(){
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

	logout = () => {
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

	getColor = (val: number, perDay: number) => {
		const borderValue = perDay*2
		val=val+perDay; //move to make it more green at 0
		if (Math.abs(val) > borderValue) val = borderValue * Math.sign(val);
		val = val / borderValue;
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
