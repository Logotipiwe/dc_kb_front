import {action, observable} from "mobx";
import RootStore from './RootStore'
import HomeUI from "./UIStore/HomeUI";
import TransactionsUI from "./UIStore/TransactionsUI";
import LoginUI from "./UIStore/LoginUI";
import WalletsUI from "./UIStore/WalletsUI";
import AnalyticsUI from "./UIStore/AnalyticsUI";
import {ActiveStories} from "../global";

class UIStore {
	constructor(RootStore: RootStore) {
		this.RootStore = RootStore;

		this.HomeUI = new HomeUI(this);
		this.TransactionsUI = new TransactionsUI(this);
		this.WalletsUI = new WalletsUI(this);
		this.AnalyticsUI = new AnalyticsUI(this);

		//после остальных UI
		this.LoginUI = new LoginUI(this);
	}

	RootStore: RootStore;
	HomeUI: HomeUI;
	WalletsUI: WalletsUI;
	TransactionsUI: TransactionsUI;
	AnalyticsUI: AnalyticsUI;
	LoginUI: LoginUI;

	@observable activeStory: ActiveStories = (process.env.NODE_ENV === 'development') ? "transactions" : 'home';

	@action.bound onStoryChange = (e: any) => {
		this.activeStory = e.currentTarget.dataset.story;
	};

	@action.bound refreshPage(){
		this.RootStore.currDate = new Date();
		this.RootStore.fetchData();
	}
}

export default UIStore
