import RootStore from "./RootStore";
import {computed, observable} from "mobx";
import {Period} from "./models/Period";


export default class PeriodStore {
	constructor(RootStore: RootStore) {
		this.RootStore = RootStore;
	}

	RootStore: RootStore;

	@observable periods: Period[] = [];

	@computed get currPeriod(){
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
