import React from "react";
import {Input} from "@vkontakte/vkui/dist";
import RootStore from "../../../stores/RootStore";
import {inject, observer} from "mobx-react/dist";

@inject('RootStore')
@observer
export class ValueInput extends React.Component<{RootStore?: RootStore}, any> {
    render() {
        const rootStore = this.props.RootStore!;
        const {transactionsStore} = rootStore;
        const {transactionsUI} = rootStore.uiStore;

        const transValType = transactionsUI.selectedTransValueType;
        const valueFieldTitle = (transValType === 'transValue') ? 'Сумма' : "Сумма на счету";

        return <Input
            bottom={
                (transValType === "walletValue" && transactionsUI.inputValue !== null)
                    ? (transactionsStore.getType(transactionsUI.selectedType).title + ": " + Math.abs(transactionsUI.transactionValue))
                    : null
            }
            placeholder={valueFieldTitle + '...'}
            inputMode="numeric"
            onChange={transactionsUI.changeInputValue}
            value={(transactionsUI.inputValue === null) ? '' : transactionsUI.inputValue}
        />
    }
}