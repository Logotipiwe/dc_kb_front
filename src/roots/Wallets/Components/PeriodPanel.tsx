import {inject, observer} from "mobx-react/dist";
import RootStore from "../../../stores/RootStore";
import {Button, Cell, Div, FormLayout, FormLayoutGroup, Header, Input, PanelHeaderSimple} from "@vkontakte/vkui/dist";
import PeriodWallets from "./PeriodWallets";
import React from "react";
import {Icon28ArrowLeftOutline} from '@vkontakte/icons';
import {IPeriodWallet, Limit} from "../../../global";
import {NewLimit} from "../../../stores/UIStore/WalletsUI";
import NewLimitItem from "./LimitsList/LimitItem";
import LimitsList from "./LimitsList/LimitsList";


@inject("RootStore")
@observer
class PeriodPanel extends React.Component<{ RootStore?: RootStore }, any> {
	render() {
		const rootStore = this.props.RootStore!;
		const {uiStore: {walletsUI, popoutsUi}} = rootStore;

		const header = (<PanelHeaderSimple
			left={
				<Icon28ArrowLeftOutline
					onClick={() => {
						walletsUI.setActivePanel('1');
						period?.syncUI();
						walletsUI.refreshLimitsUi();
					}}
					style={{marginLeft: 10}}
				/>
			}
		>
			Период
		</PanelHeaderSimple>);

		if (!walletsUI.periodSelected) return (
			<>
				{header}
				<Cell>Период не выбран</Cell>
			</>
		);

		const period = walletsUI.periodSelected!;

		const unselectedWallets = rootStore.walletStore.wallets.filter(w =>
			period.UI.walletsInited.every((wi: IPeriodWallet) => wi.wallet !== w)
		);

		let limitsUi = walletsUI.limitsUi;
		return (
			<>
				{header}
				<FormLayout>
					<FormLayoutGroup top={<Header mode="secondary">Даты</Header>}>
						<Input top='Дата начала' type='date'
						       value={rootStore.dateStr(period.UI.startDate)}
						       onChange={period.setStartDate}
						/>
						<Input top='Дата конца' type='date'
						       value={rootStore.dateStr(period.UI.endDate)}
						       onChange={period.setEndDate}
						/>
					</FormLayoutGroup>
					<FormLayoutGroup top={<Header mode="secondary">Счета</Header>}>
						<PeriodWallets periodWallets={period.UI.walletsInited} unselectedWallets={unselectedWallets}/>
					</FormLayoutGroup>

					<FormLayoutGroup top="Лимиты">
						<LimitsList list={limitsUi}/>
					</FormLayoutGroup>

					<FormLayoutGroup top='Начальные накопления'
					                 bottom={"Начальные накопления можно потратить на крупные ежемесячные расходы"}>
						<Div style={{display: 'flex'}}>
							<Div style={{display: "flex", flexGrow: 1}}>Накопления</Div>
							<Input
								style={{width: 100}}
								type='numeric'
								value={period.UI.initStore}
								onChange={period.setInitStore}
							/>
							<div style={{width: 24}}/>
						</Div>
					</FormLayoutGroup>

					<Button
						onClick={walletsUI.periodEdit.bind(null, period)}
						mode="commerce"
						size='xl'
					>
						Сохранить
					</Button>
					<Button mode='secondary' onClick={popoutsUi.setDeletingPeriod.bind(null, period)}>Удалить период</Button>
				</FormLayout>
			</>
		);
	}
}

export default PeriodPanel
