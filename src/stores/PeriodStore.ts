import RootStore from "./RootStore";
import {computed, makeAutoObservable, observable, toJS} from "mobx";
import {Period} from "./models/Period";
import autoBind from "../utils/autoBind";
import {INewPeriodWallet, IPeriodWallet, Limit, Nullable} from "../global";
import Wallet from "./models/Wallet";
import WalletsUI from "./UIStore/WalletsUI";
import React, {RefObject} from "react";


export default class PeriodStore {
	constructor(rootStore: RootStore) {
		makeAutoObservable(this)
		autoBind(this)
		this.RootStore = rootStore;
	}

	RootStore: RootStore;

	isDev: boolean = process.env.NODE_ENV === "development";

	periods: Period[] = [];
	limits: Limit[] = [];

	getPeriodLimits(periodId: number){
		return this.limits.filter(l=>l.period_id===periodId)
	}

	get currPeriod(){
		const currTimestamp = this.RootStore.currDate.getTime();
		const filtered = this.periods.filter((period)=>(
			(period.startDate.getTime() <= currTimestamp)
			&& (period.endDate.getTime() >= currTimestamp)
		));
		return (filtered.length) ? filtered[0] : null;
	}

	getPeriod(id: number){
		return this.periods.filter(p=>p.id === id)[0];
	}
}
