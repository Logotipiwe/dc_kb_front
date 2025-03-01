import React from "react";
import RootStore from "../../../stores/RootStore";
import {inject, observer} from "mobx-react/dist";
import {IType} from "../../../global";

export interface TypeFastClickItemProps {
    RootStore?: RootStore
    i: number
    type: IType
}

@inject('RootStore')
@observer
export class TypeFastClickItem extends React.Component<TypeFastClickItemProps, any>{
    render() {
        const RootStore = this.props.RootStore!;
        const {transactionsUI} = RootStore.uiStore;

        return <div
            onClick={transactionsUI.changeType.bind(null, this.props.type.id)}
            className={"type-fast-click-item"}
            style={{display: "flex", justifyContent: "center"}}
        >{this.props.i+1}</div>
    }
}