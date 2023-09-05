import React from "react";
import {RootStoreProp} from "../../../stores/RootStore";
import {Select} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";

@inject('RootStore')
@observer
export class WalletSelect extends React.Component<RootStoreProp, any>{
    render() {

        const RootStore = this.props.RootStore!;
        const {transactionsUI} = RootStore.uiStore;
        const {wallets} = RootStore.walletStore;

        return (<>
                    <Select
                        className={"my_form_select"}
                        onChange={transactionsUI.changeWalletId}
                        top='Счет'
                        value={(transactionsUI.selectedWallet !== null) ? transactionsUI.selectedWallet.id : wallets[0].id}>
                        {wallets.map(wallet => {
                            const value = (wallet.value) ? '(' + wallet.value + 'p)' : null;
                            return <option value={wallet.id} key={wallet.id}>{wallet.title} {value}</option>
                        })}
                    </Select>
            </>
        );
    }

}