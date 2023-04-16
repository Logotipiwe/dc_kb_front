import React from "react";
import {Input} from "@vkontakte/vkui";
import RootStore from "../../../stores/RootStore";
import {inject, observer} from "mobx-react";

@inject('RootStore')
@observer
export class ValueInput extends React.Component<{RootStore?: RootStore}, any> {
    render() {
        const rootStore = this.props.RootStore!;
        const {TransactionsStore} = rootStore;
        const {TransactionsUI} = rootStore.UIStore;

        const transValType = TransactionsUI.selectedTransValueType;
        const valueFieldTitle = (transValType === 'transValue') ? 'Сумма' : "Сумма на счету";

        return <Input
            bottom={
                (transValType === "walletValue" && TransactionsUI.inputValue !== null)
                    ? (TransactionsStore.getType(TransactionsUI.selectedType).title + ": " + Math.abs(TransactionsUI.transactionValue))
                    : null
            }
            placeholder={valueFieldTitle + '...'}
            inputMode="numeric"
            onChange={TransactionsUI.changeInputValue}
            value={(TransactionsUI.inputValue === null) ? '' : TransactionsUI.inputValue}
        />
    }
}