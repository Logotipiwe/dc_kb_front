import {action, computed, observable} from "mobx";
import {ChangeEvent} from "react";
import {IPeriod, IPeriodUI, IPeriodWallet} from "../../global";

export class Period {
	constructor(period: IPeriod) {
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
	}

	@observable id: number;
	@observable startDate: Date;
	@observable endDate: Date;
	@observable walletsInited: IPeriodWallet[] = [];
	@observable initStore: number;

	@observable UI: IPeriodUI;

	@action.bound syncUI(){
		this.UI = {
			initStore: this.initStore,
			startDate: this.startDate,
			endDate: this.endDate,
			walletsInited: this.walletsInited
		}
	}

	@action.bound setStartDate(e: ChangeEvent<HTMLInputElement>){
		this.UI.startDate = new Date(e.target.value);
	}

	@action.bound setEndDate(e: ChangeEvent<HTMLInputElement>){
		this.UI.endDate = new Date(e.target.value);
	}

	@action.bound setInitStore(e: ChangeEvent<HTMLInputElement>){
		this.UI.initStore = parseInt(e.target.value) || 0;
	}

	@computed get validNewPeriodWallets() {
		return this.UI.walletsInited.filter(item =>
			item.wallet && !isNaN(item.sum)
		)
	}
}
