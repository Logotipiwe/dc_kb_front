import React from "react";
import {RootStoreProp} from "../../../stores/RootStore";
import {Select} from "@vkontakte/vkui/dist";
import {inject, observer} from "mobx-react/dist";

@inject('RootStore')
@observer
export class TypeSelect extends React.Component<RootStoreProp, any> {
    render() {
        const RootStore = this.props.RootStore!;
        const {transactionsUI} = RootStore.uiStore;
        const {transactionsStore} = RootStore;

        const typesToShow = transactionsStore.availableTypes;
        const transValType = transactionsUI.selectedTransValueType;

        return <>
            <Select
                className={"my_form_select"}
                onChange={transactionsUI.onChangeType}
                value={(transactionsUI.selectedType !== null) ? transactionsUI.selectedType : typesToShow[0].id}
            >
                {typesToShow.map(type =>
                    <option value={type.id} key={type.id}>{type.title}</option>
                )}
            </Select>
        </>
    }
}