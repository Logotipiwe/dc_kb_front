import ModalPageHeader from "@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import {Cell, Div, FormLayout, FormLayoutGroup, InfoRow, Input, ModalPage} from "@vkontakte/vkui/dist";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {Icon24Cancel} from '@vkontakte/icons'
import React from "react";
import {inject, observer} from "mobx-react/dist";
import FormStatus from "@vkontakte/vkui/dist/components/FormStatus/FormStatus";
import PeriodWallets from "./PeriodWallets";

@inject("RootStore")
@observer
class NewPeriodModal extends React.Component<any, any> {
    render() {
        const RootStore = this.props.RootStore!;
        const walletsUI = RootStore.uiStore.walletsUI;
        return (
            <ModalPage
                id={'newPeriod'}
                header={
                    <ModalPageHeader
                        left={<PanelHeaderButton
                            onClick={walletsUI.onNewPeriodModalClose}><Icon24Cancel/></PanelHeaderButton>}
                    >
                        Новый период
                    </ModalPageHeader>
                }
            >
                <FormLayout>
                    {walletsUI.showErr && <FormStatus header="Ошибка ввода данных" mode="error">
                        Проверьте правильность полей.
                    </FormStatus>}
                    <FormLayoutGroup
                        top='Даты начала и конца периода'
                    >
                        <Input
                            onChange={walletsUI.inputNewPeriodStartDate}
                            value={walletsUI.newPeriodStartDate || ''}
                            type="date"
                            max={walletsUI.newPeriodMaxAvailableDate}
                        />
                        <Input
                            onChange={walletsUI.inputNewPeriodEndDate}
                            value={walletsUI.newPeriodEndDate || ''}
                            type="date"
                            min={walletsUI.newPeriodMinAvailableDate}
                        />
                        <Button onClick={walletsUI.setNewPeriodFullMonth}>На весь текущий месяц</Button>
                    </FormLayoutGroup>
                    <FormLayoutGroup top='Начальные суммы счетов'>

                        <PeriodWallets periodWallets={walletsUI.newPeriodWallets}
                                       unselectedWallets={walletsUI.newPeriodUnselectedWallets}/>

                    </FormLayoutGroup>
                    <FormLayoutGroup
                        top='Начальные накопления'
                        bottom={"Начальные накопления вычтутся из начальной суммы периода и отложатся для крупных ежемесячных расходов, вы можете их оформить указав тип транзакции 'Вложение'"}
                    >
                        <Div style={{display: 'flex'}}>
                            <Div style={{display: "flex", flexGrow: 1}}>Накопления</Div>
                            <Input
                                style={{width: 100}}
                                type='numeric'
                                value={walletsUI.newPeriodInitStore}
                                onChange={e => walletsUI.setNewPeriodInitStore(parseInt(e.target.value))}
                            />
                            <div style={{width: 24}}/>
                        </Div>
                    </FormLayoutGroup>
                    <Cell>
                        <InfoRow header="Всего в периоде">{walletsUI.newPeriodWalletsSum} p</InfoRow>
                        <InfoRow header="В день">{walletsUI.newPeriodPerDay}</InfoRow>
                    </Cell>
                    <FormStatus mode={"error"}>
                        <p style={{fontSize: 17, margin: 0}}>
                            Невозможно создать период, пересекающийся с уже существующим
                        </p>
                    </FormStatus>
                    <Button
                        size="xl"
                        mode="commerce"
                        onClick={walletsUI.newPeriod}
                    >
                        Создать период
                    </Button>
                </FormLayout>
            </ModalPage>
        )
    }
}

export default NewPeriodModal;
