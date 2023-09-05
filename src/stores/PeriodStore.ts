import RootStore from "./RootStore";
import {computed, makeAutoObservable, observable} from "mobx";
import {Period} from "./models/Period";
import autoBind from "../utils/autoBind";
import {Limit} from "../global";


export default class PeriodStore {
	constructor(RootStore: RootStore) {
		makeAutoObservable(this)
		autoBind(this)
		this.RootStore = RootStore;
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
