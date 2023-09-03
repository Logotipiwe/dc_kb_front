import {action, makeAutoObservable, observable} from "mobx";
import RootStore from './RootStore'
import HomeUI from "./UIStore/HomeUI";
import TransactionsUI from "./UIStore/TransactionsUI";
import LoginUI from "./UIStore/LoginUI";
import WalletsUI from "./UIStore/WalletsUI";
import AnalyticsUI from "./UIStore/AnalyticsUI";
import {ActiveStories} from "../global";
import rootStore from "./RootStore";
import autoBind from "../utils/autoBind";

class UIStore {
	constructor(rootStore: RootStore) {
		makeAutoObservable(this)
		autoBind(this)
		this.rootStore = rootStore;

		this.HomeUI = new HomeUI(this);
		this.TransactionsUI = new TransactionsUI(this);
		this.WalletsUI = new WalletsUI(this);
		this.AnalyticsUI = new AnalyticsUI(this);

		//после остальных UI
		this.LoginUI = new LoginUI(this);
	}

	isDev: boolean = process.env.NODE_ENV === "development";

	rootStore: RootStore;
	HomeUI: HomeUI;
	WalletsUI: WalletsUI;
	TransactionsUI: TransactionsUI;
	AnalyticsUI: AnalyticsUI;
	LoginUI: LoginUI;

	activeStory: ActiveStories = this.isDev ? "wallets" : 'home';

	onStoryChange = (e: any) => {
		this.activeStory = e.currentTarget.dataset.story;
	};

	refreshPage(){
		this.rootStore.currDate = new Date();
		this.rootStore.fetchData();
	}
}

export default UIStore
