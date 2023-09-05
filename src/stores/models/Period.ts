import {action, computed, makeAutoObservable, observable} from "mobx";
import {ChangeEvent} from "react";
import {IPeriod, IPeriodUI, IPeriodWallet} from "../../global";
import autoBind from "../../utils/autoBind";

export class Period {
	constructor(period: IPeriod) {
		makeAutoObservable(this)
		this.id = period.id;
		this.startDate = period.startDate;
		this.endDate = period.endDate;
		this.initStore = period.initStore;
		this.walletsInited = period.walletsInited;
		this.UI = {
			initStore: period.initStore,
			startDate: period.startDate,
			endDate: period.endDate,
			walletsInited: period.walletsInited
		}

		this.setInitStore = this.setInitStore.bind(this);
		this.syncUI = this.syncUI.bind(this);
		this.setStartDate = this.setStartDate.bind(this);
		this.setEndDate = this.setEndDate.bind(this);
	}

	id: number;
	startDate: Date;
	endDate: Date;
	walletsInited: IPeriodWallet[] = [];
	initStore: number;

	UI: IPeriodUI;

	syncUI(){
		this.UI = {
			initStore: this.initStore,
			startDate: this.startDate,
			endDate: this.endDate,
			walletsInited: this.walletsInited
		}
	}

	setStartDate(e: ChangeEvent<HTMLInputElement>){
		this.UI.startDate = new Date(e.target.value);
	}

	setEndDate(e: ChangeEvent<HTMLInputElement>){
		this.UI.endDate = new Date(e.target.value);
	}

	setInitStore(e: ChangeEvent<HTMLInputElement>){
		this.UI.initStore = parseInt(e.target.value) || 0;
	}

	get validNewPeriodWallets() {
		return this.UI.walletsInited.filter(item =>
			item.wallet && !isNaN(item.sum)
		)
	}
}
