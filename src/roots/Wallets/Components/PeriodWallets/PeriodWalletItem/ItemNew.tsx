import {Div, Input, Select} from "@vkontakte/vkui";
import React from "react";
import Wallet from "../../../../../stores/models/Wallet";
import {inject} from "mobx-react";
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
		const {WalletStore} = RootStore;
		const {walletsToSelect, wallet, sum} = this.props;
		return (
			<Div style={{display: "flex"}}>
				<Select
					style={{flexGrow: 1}}
					onChange={e=>wallet.onChange(WalletStore.getWallet(parseInt(e.target.value)))}
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
