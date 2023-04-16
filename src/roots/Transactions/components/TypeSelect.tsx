import React from "react";
import {RootStoreProp} from "../../../stores/RootStore";
import {Select} from "@vkontakte/vkui";
import {inject, observer} from "mobx-react";

@inject('RootStore')
@observer
export class TypeSelect extends React.Component<RootStoreProp, any> {
    render() {
        const RootStore = this.props.RootStore!;
        const {TransactionsUI} = RootStore.UIStore;
        const {TransactionsStore} = RootStore;

        const typesToShow = TransactionsStore.availableTypes;
        const transValType = TransactionsUI.selectedTransValueType;

        return <>
            <Select
                className={"my_form_select"}
                onChange={TransactionsUI.changeType}
                value={(TransactionsUI.selectedType !== null) ? TransactionsUI.selectedType : typesToShow[0].id}
            >
                {typesToShow.map(type =>
                    <option value={type.id} key={type.id}>{type.title}</option>
                )}
            </Select>
        </>
    }
}