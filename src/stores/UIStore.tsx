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
import PopoutsUi from "./UIStore/popouts/PopoutsUi";
import BalancesUi from "./UIStore/BalancesUi";


class UIStore {
	constructor(rootStore: RootStore) {
		makeAutoObservable(this)
		autoBind(this)
		this.rootStore = rootStore;

		this.homeUI = new HomeUI(this);
		this.transactionsUI = new TransactionsUI(this);
		this.walletsUI = new WalletsUI(this);
		this.analyticsUI = new AnalyticsUI(this);
		this.popoutsUi = new PopoutsUi(this);
		this.balancesUi = new BalancesUi(this);

		//после остальных UI
		this.loginUI = new LoginUI(this);
	}

	isDev: boolean = process.env.NODE_ENV === "development";

	rootStore: RootStore;
	homeUI: HomeUI;
	walletsUI: WalletsUI;
	transactionsUI: TransactionsUI;
	analyticsUI: AnalyticsUI;
	loginUI: LoginUI;
	popoutsUi: PopoutsUi;
	balancesUi: BalancesUi;

	activeStory: ActiveStories = this.isDev ? "transactions" : 'home';

	onStoryChange = (e: any) => {
		this.activeStory = e.currentTarget.dataset.story;
	};

	refreshPage(){
		this.rootStore.currDate = new Date();
		this.rootStore.fetchData();
	}
}

export default UIStore
