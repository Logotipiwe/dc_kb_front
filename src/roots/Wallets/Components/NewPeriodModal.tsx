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
		const {WalletsUI} = RootStore.UIStore;
		return (
			<ModalPage
				id={'newPeriod'}
				header={
					<ModalPageHeader
						left={<PanelHeaderButton
							onClick={WalletsUI.onNewPeriodModalClose}><Icon24Cancel/></PanelHeaderButton>}
					>
						Новый период
					</ModalPageHeader>
				}
			>
				<FormLayout>
					{WalletsUI.showErr && <FormStatus header="Ошибка ввода данных" mode="error">
						Проверьте правильность полей.
					</FormStatus>}
					<FormLayoutGroup
						top='Даты начала и конца периода'
					>
						<Input
							onChange={WalletsUI.inputNewPeriodStartDate}
							value={WalletsUI.newPeriodStartDate || ''}
							type="date"
							max={WalletsUI.newPeriodMaxAvailableDate}
						/>
						<Input
							onChange={WalletsUI.inputNewPeriodEndDate}
							value={WalletsUI.newPeriodEndDate || ''}
							type="date"
							min={WalletsUI.newPeriodMinAvailableDate}
						/>
						<Button onClick={WalletsUI.setNewPeriodFullMonth}>На весь текущий месяц</Button>
					</FormLayoutGroup>
					<FormLayoutGroup top='Начальные суммы счетов'>

						<PeriodWallets periodWallets={WalletsUI.newPeriodWallets} unselectedWallets={WalletsUI.newPeriodUnselectedWallets}/>

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
								value={WalletsUI.newPeriodInitStore}
								onChange={e => WalletsUI.setNewPeriodInitStore(parseInt(e.target.value))}
							/>
							<div style={{width: 24}}/>
						</Div>
					</FormLayoutGroup>
					<Cell>
						<InfoRow header="Всего в периоде">{WalletsUI.newPeriodWalletsSum} p</InfoRow>
						<InfoRow header="В день">{WalletsUI.newPeriodPerDay}</InfoRow>
					</Cell>
					<FormStatus mode={"error"}>
						<p style={{fontSize: 17, margin: 0}}>
							Невозможно создать период, пересекающийся с уже существующим
						</p>
					</FormStatus>
					<Button
						size="xl"
						mode="commerce"
						onClick={WalletsUI.newPeriod}
					>
						Создать период
					</Button>
				</FormLayout>
			</ModalPage>
		)
	}
}

export default NewPeriodModal;
