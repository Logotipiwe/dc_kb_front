import React, {RefObject} from "react";
import {withModalRootContext} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";
import RootStore from "../../../stores/RootStore";
import {action, makeAutoObservable} from "mobx";
import WalletsUI from "../../../stores/UIStore/WalletsUI";
import Wallet from "../../../stores/models/Wallet";
import PeriodWalletItem from "./PeriodWallets/PeriodWalletItem";
import {INewPeriodWallet, IPeriodWallet, Nullable} from "../../../global";
import autoBind from "../../../utils/autoBind";

interface props {
	periodWallets: IPeriodWallet[],
	unselectedWallets: Wallet[],
	RootStore?: RootStore,
	updateModalHeight?: Function
}
interface state {
	newWallet: INewPeriodWallet
}

@inject("RootStore")
@observer
class PeriodWallets extends React.Component<props, state> {
	constructor(props: props) {
		super(props);
		autoBind(this)
		this.state = {
			newWallet: WalletsUI.defaultNewPeriodWalletsObj
		};
		this.newInputRef = React.createRef();
	}

	newInputRef: RefObject<HTMLInputElement>;

	newItemOnChangeValue(val: number){
		this.setState(s => {
			const newState = Object.assign({}, s);
			newState.newWallet.sum = val;
			return newState;
		}, this.checkPushNewPeriodWallet);
	}

	newItemOnChangeWallet(wallet: Nullable<Wallet>){
		this.setState(s => {
			const newState = Object.assign({}, s);
			newState.newWallet.wallet = wallet;
			return newState;
		}, this.checkPushNewPeriodWallet);
	}

	checkPushNewPeriodWallet(){
		if(!(this.state.newWallet.wallet && !isNaN(this.state.newWallet.sum))) return;
		this.props.periodWallets.push({
			wallet: this.state.newWallet.wallet,
			sum: this.state.newWallet.sum,
			isAddToBalance: true
		});
		this.setState({newWallet: WalletsUI.defaultNewPeriodWalletsObj});
		this.props.updateModalHeight!();
	}

	selectPeriodWallet(item: IPeriodWallet, wallet: Wallet) {
		item.wallet = wallet;
		this.setState(this.state)
	}

	changePeriodWalletValue(item: IPeriodWallet, sum: number) {
		item.sum = sum;
		this.setState(this.state)
	}

	delNewPeriodWallet(periodWallet: IPeriodWallet) {
		const propWallets = this.props.periodWallets;
		const pos = propWallets.indexOf(periodWallet);
		propWallets.splice(pos,1);

		this.props.updateModalHeight!();
		this.setState(this.state)
	}

	changePeriodWalletIsAddToBalance(periodWallet: IPeriodWallet, val: boolean){
		periodWallet.isAddToBalance = val;
		this.setState(this.state)
	}

	render() {
		const {periodWallets, unselectedWallets} = this.props;
		return (
			<>
				{periodWallets.map((item, i) => {
					const walletsToSelect = [
						...unselectedWallets,
						item.wallet
					];
					return <PeriodWalletItem
						key={i}
						item={item}
						changeWallet={this.selectPeriodWallet}
						changeValue={this.changePeriodWalletValue}
						onChangeValue={val=>this.changePeriodWalletValue(item, val)}
						changeIsAddToBalance={this.changePeriodWalletIsAddToBalance}
						walletsToSelect={walletsToSelect}
						delNewPeriodWallet={this.delNewPeriodWallet}
					/>
				})}
				{(unselectedWallets.length)
					? (<PeriodWalletItem.New
						sum={{value: this.state.newWallet.sum, onChange: this.newItemOnChangeValue}}
						wallet={{value: this.state.newWallet.wallet, onChange: this.newItemOnChangeWallet}}
						walletsToSelect={unselectedWallets}
					/>)
					: null
				}
			</>
		);
	}
}

export default withModalRootContext(PeriodWallets);
