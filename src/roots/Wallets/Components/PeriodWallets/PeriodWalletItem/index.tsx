import Wallet from "../../../../../stores/models/Wallet";
import React from "react";
import ItemNew from "./ItemNew";
import {Icon24Cancel} from '@vkontakte/icons';
import {Div, Input, Select, Checkbox} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";
import RootStore from "../../../../../stores/RootStore";
import {IPeriodWallet} from "../../../../../global";

@inject("RootStore")
@observer
class PeriodWalletItem extends React.Component<{
    RootStore?: RootStore,
    item: IPeriodWallet,
    changeWallet: (p: IPeriodWallet, x: Wallet) => void,
    changeValue: (p: IPeriodWallet, x: number) => void,
    changeIsAddToBalance: (p: IPeriodWallet, x: boolean) => void,
    walletsToSelect: Wallet[],
    delNewPeriodWallet: Function
}, any> {

    static New = ItemNew;

    render() {
        const RootStore = this.props.RootStore!;
        const {walletStore} = RootStore;
        const {item, walletsToSelect, delNewPeriodWallet} = this.props;
        return (
            <Div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexGrow: 1}}>
                    <Select
                        style={{flexGrow: 1}}
                        onChange={e => this.props.changeWallet(item, walletStore.getWallet(parseInt(e.target.value)))}
                        value={item.wallet.id}
                    >
                        <option disabled value="null">Выбрать счёт</option>
                        {walletsToSelect.map(w =>
                            <option key={w.id}
                                    value={w.id}>{w.title} {((w.value) ? ("(" + (Math.round(w.value / 100) / 10) + " к)") : null)}</option>
                        )}
                    </Select>
                    <Input
                        onChange={e => this.props.changeValue(item, parseInt(e.target.value))}
                        autoFocus={true}
                        value={isNaN(item.sum) ? '' : item.sum}
                        style={{width: '80px'}}
                        type='numeric'
                    />
                    <Icon24Cancel
                        fill={'gray'}
                        onClick={delNewPeriodWallet.bind(null, item)}
                        style={{alignSelf: "center", opacity: 1}}
                    />
                </div>
                <div>
                    <Checkbox checked={item.isAddToBalance} onChange={e=>this.props.changeIsAddToBalance(item, e.target.checked)}>В баланс</Checkbox>
                </div>
            </Div>
        );
    }
}

export default PeriodWalletItem;
