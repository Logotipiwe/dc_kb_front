import {inject, observer} from "mobx-react";
import RootStore from "../../../stores/RootStore";
import {Button, Cell, Div, FormLayout, FormLayoutGroup, Header, Input, PanelHeaderSimple} from "@vkontakte/vkui";
import PeriodWallets from "./PeriodWallets";
import React from "react";
import Icon28ArrowLeftOutline from '@vkontakte/icons/dist/28/arrow_left_outline';
import {IPeriodWallet} from "../../../global";


@inject("RootStore")
@observer
class PeriodPanel extends React.Component<{ RootStore?: RootStore }, any> {
	render() {
		const RootStore = this.props.RootStore!;
		const {UIStore: {WalletsUI}} = RootStore;

		const header = (<PanelHeaderSimple
			left={
				<Icon28ArrowLeftOutline
					onClick={() => {
						WalletsUI.setActivePanel('1');
						periodSel?.syncUI();
					}}
					style={{marginLeft: 10}}
				/>
			}
		>
			Период
		</PanelHeaderSimple>);

		if (!WalletsUI.periodSelected) return (
			<>
				{header}
				<Cell>Период не выбран</Cell>
			</>
		);

		const periodSel = WalletsUI.periodSelected!;

		const unselectedWallets = RootStore.WalletStore.wallets.filter(w =>
			periodSel.UI.walletsInited.every((wi: IPeriodWallet) => wi.wallet !== w)
		);

		return (
			<>
				{header}
				<FormLayout>
					<FormLayoutGroup top={<Header mode="secondary">Даты</Header>}>
						<Input top='Дата начала' type='date'
						       value={RootStore.dateStr(periodSel.UI.startDate)}
						       onChange={periodSel.setStartDate}
						/>
						<Input top='Дата конца' type='date'
						       value={RootStore.dateStr(periodSel.UI.endDate)}
						       onChange={periodSel.setEndDate}
						/>
					</FormLayoutGroup>
					<FormLayoutGroup top={<Header mode="secondary">Счета</Header>}>
						<PeriodWallets periodWallets={periodSel.UI.walletsInited} unselectedWallets={unselectedWallets}/>
					</FormLayoutGroup>

					<FormLayoutGroup top='Начальные накопления'
					                 bottom={"Начальные накопления можно потратить на крупные ежемесячные расходы"}>
						<Div style={{display: 'flex'}}>
							<Div style={{display: "flex", flexGrow: 1}}>Накопления</Div>
							<Input
								style={{width: 100}}
								type='numeric'
								value={periodSel.UI.initStore}
								onChange={periodSel.setInitStore}
							/>
							<div style={{width: 24}}/>
						</Div>
					</FormLayoutGroup>

					<Button
						onClick={WalletsUI.periodEdit.bind(null, periodSel)}
						mode="commerce"
						size='xl'
					>
						Сохранить
					</Button>
					<Button mode='secondary' onClick={WalletsUI.setIsDeletingPeriod.bind(null, true)}>Удалить период</Button>
				</FormLayout>
			</>
		);
	}
}

export default PeriodPanel
