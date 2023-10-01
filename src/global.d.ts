import Wallet from "./stores/models/Wallet";

type Nullable<T> = null | T;
type TransModal = Nullable<"newTrans">;
type LoginView = "reg" | "login";
type ActiveStories = "home" | "transactions" | "menu" | "wallets" | "analytics";
type WalletPageModals = "newWallet" | "delWallet" | "newPeriod" | "editPeriod" | "delPeriod";
type TransValueTypes = "transValue" | "walletValue";
type WalletsActivePanels = "1" | "period";

interface IPeriodRes{
	id: number,
	start_date: string,
	end_date: string,
	init_store: number,
	wallets_inited: IPeriodWalletRes[]
}
interface IPeriod{
	id: number,
	endDate: Date,
	startDate: Date,
	initStore: number,
	walletsInited: IPeriodWallet[]
}
interface INewPeriodWallet {
	wallet: Nullable<Wallet>,
	sum: number //NaN если не определен
}

interface IPeriodUI {
	startDate: Date,
	endDate: Date,
	initStore: number,
	walletsInited: IPeriodWallet[]
}

interface IWallet {
	id: number,
	title: string,
	value: Nullable<number>,
	init: Nullable<number>
}

type IPeriodWalletRes = {
	id: number,
	sum: number,
	is_add_to_balance: 1|0
}
type IPeriodWallet = {
	wallet: Wallet,
	sum: number,
	isAddToBalance: boolean
}
interface IPeriodWalletFieldProp<T> {
	value: T,
	onChange: (x: T)=>void
}



interface IType {
	id: number,
	title: string,
	img: string
}

interface ICategory {
	id: number,
	title: string,
	img: string,
	parent?: number,
	color: string,
	types: number[]
}

interface ITransaction {
	id: number,
	wallet_id: number,
	time: string,
	value: number,
	type: number,
	to_wallet: Nullable<number>,
	category: Nullable<number>,
	title: string,
	to_title: Nullable<string>,
	tags_ids: number[],
	is_add_to_balance: Nullable<boolean>,
	is_unnecessary: number
}

interface ITransactionType {
	id: number,
	img: string,
	title: string
}

interface IGetDataResponse {
	ok: boolean,
	ans: IGetDataAnsResponse
}

interface IOutcomeByCategory {
	title: string,
	sum: number,
	img: string,
	color: string
}

interface LimitDto {
	id,period_id,category_id,amount: number
}
interface Limit {
	id,period_id,amount: number
	category: ICategory
}

interface IGetDataAnsResponse {
	categories: Record<any, ICategory>,
	transactions: any,
	balances: Record<string, number>,
	limit_balances: Record<string, Record<string, number>|null >
	all_limits: LimitDto[]
	wallets: IWallet[]
	transaction_types: ITransactionType[],
	periods: IPeriodRes[],
	curr_period: IPeriodRes,
	user_id: number,
	analytics: IAnalyticsResponse,
}

interface IGetData extends IGetDataAnsResponse {
	limit_balances: Record<string, Record<string, number> >
}

interface IAnalyticsResponse {
	init_sum: number,
	invested: number,
	month_analytics: {
		outcomes_by_category: IOutcomeByCategory[]
	},
	per_day: number,
	stored: number,
	value_real_left: number,
	value_sum: number
}
