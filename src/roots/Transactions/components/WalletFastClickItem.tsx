import React from "react";
import RootStore, {RootStoreProp} from "../../../stores/RootStore";
import {Select} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";
import Wallet from "../../../stores/models/Wallet";

export interface WalletFastClickItemProps {
    RootStore?: RootStore
    i: number
    wallet: Wallet
}

@inject('RootStore')
@observer
export class WalletFastClickItem extends React.Component<WalletFastClickItemProps, any>{
    render() {
        const RootStore = this.props.RootStore!;
        const {transactionsUI} = RootStore.uiStore;

        return <div
            onClick={transactionsUI.changeWalletId.bind(null, this.props.wallet.id)}
            className={"wallet-fast-click-item"}
            style={{display: "flex", justifyContent: "center"}}
        >{this.props.i+1}</div>
    }
}