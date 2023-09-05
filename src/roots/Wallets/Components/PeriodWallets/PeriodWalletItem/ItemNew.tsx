import {Div, Input, Select} from "@vkontakte/vkui/dist";
import React from "react";
import Wallet from "../../../../../stores/models/Wallet";
import {inject} from "mobx-react/dist";
import RootStore from "../../../../../stores/RootStore";
import {IPeriodWalletFieldProp, Nullable} from "../../../../../global";

@inject("RootStore")
class ItemNew extends React.Component<{
	RootStore?: RootStore,
	sum: IPeriodWalletFieldProp<number>,
	wallet: IPeriodWalletFieldProp<Nullable<Wallet>>,
	walletsToSelect: Wallet[],
}, any>{
	render() {
		const RootStore = this.props.RootStore!;
		const {walletStore} = RootStore;
		const {walletsToSelect, wallet, sum} = this.props;
		return (
			<Div style={{display: "flex"}}>
				<Select
					style={{flexGrow: 1}}
					onChange={e=>wallet.onChange(walletStore.getWallet(parseInt(e.target.value)))}
					value={(wallet.value) ? wallet.value.id : "null"}
				>
					<option disabled value="null">Выбрать счёт</option>
					{walletsToSelect.map(w =>
						<option key={w.id} value={w.id}>{w.title} {((w.value) ? ("("+(Math.round(w.value/100)/10)+" к)") : null)}</option>
					)}
				</Select>
				<Input
					onChange={e=>sum.onChange(parseInt(e.target.value))}
					value={(isNaN(sum.value) ? '' : sum.value)}
					style={{width: '100px'}}
					type='numeric'
				/>
				<div style={{width: 24}}/>
			</Div>
		);
	}
}
export default ItemNew
