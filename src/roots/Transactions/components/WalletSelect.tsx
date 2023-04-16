import React from "react";
import {RootStoreProp} from "../../../stores/RootStore";
import {Select} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";

@inject('RootStore')
@observer
export class WalletSelect extends React.Component<RootStoreProp, any>{
    render() {

        const RootStore = this.props.RootStore!;
        const {TransactionsUI} = RootStore.UIStore;
        const {wallets} = RootStore.WalletStore;

        return (<>
                    <Select
                        className={"my_form_select"}
                        onChange={TransactionsUI.changeWalletId}
                        top='Счет'
                        value={(TransactionsUI.selectedWallet !== null) ? TransactionsUI.selectedWallet.id : wallets[0].id}>
                        {wallets.map(wallet => {
                            const value = (wallet.value) ? '(' + wallet.value + 'p)' : null;
                            return <option value={wallet.id} key={wallet.id}>{wallet.title} {value}</option>
                        })}
                    </Select>
            </>
        );
    }

}