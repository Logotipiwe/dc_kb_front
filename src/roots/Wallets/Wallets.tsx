import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import {
	Cell,
	Div,
	Header, ModalRoot,
	Root,
	View,
	PullToRefresh, Card, Alert
} from "@vkontakte/vkui/dist";
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import {Icon24BrowserForward} from "@vkontakte/icons";

import PanelHeader from "../../PanelHeader";

import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";
import NewWalletModal from "./Components/NewWalletModal";
import DelWalletModal from "./Components/DelWalletModal";
import NewPeriodModal from "./Components/NewPeriodModal";
import PeriodPanel from "./Components/PeriodPanel";

@inject("RootStore")
@observer
class Wallets extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
	componentDidMount() {
		if (process.env.NODE_ENV === "development") {
			// const RootStore = this.props.RootStore!;
			// const WalletsUI = RootStore.UIStore.WalletsUI;
			// WalletsUI.periodSelected = RootStore.PeriodStore.getPeriod(65);
			// WalletsUI.activePanel = "period";
		}
	}

	render() {
		const RootStore = this.props.RootStore!;
		const {UIStore, PeriodStore} = RootStore;
		const {WalletsUI} = UIStore;

		const wallets = RootStore.WalletStore.wallets;
		const periods = RootStore.PeriodStore.periods;

		const currPeriod = PeriodStore.currPeriod;

		const modal = (
			<ModalRoot activeModal={WalletsUI.activeModal}>
				<NewWalletModal
					id={'newWallet'}
					dynamicContentHeight
					onClose={WalletsUI.setActiveModal.bind(null, null)}
				/>
				<DelWalletModal
					id={'delWallet'}
					wallet={WalletsUI.deletingWallet!}
					onClose={WalletsUI.setActiveModal.bind(null, null)}
				/>
				<NewPeriodModal
					id={'newPeriod'}
					dynamicContentHeight
					onClose={WalletsUI.onNewPeriodModalClose}
				/>
			</ModalRoot>
		);

		const periodSel = WalletsUI.periodSelected;
		const popout = (periodSel !== undefined && WalletsUI.isDeletingPeriod) ? (
			<Alert
				actionsLayout="vertical"
				actions={[{
					title: 'Удалить период',
					autoclose: true,
					mode: 'destructive',
					action: WalletsUI.periodDelete.bind(null, periodSel),
				}, {
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
				}]}
				onClose={WalletsUI.setIsDeletingPeriod.bind(null, false)}
			>
				<h2>Удалить период
					с {RootStore.dateHuman(periodSel!.startDate)} по {RootStore.dateHuman(periodSel!.endDate)}?</h2>
			</Alert>
		) : null;

		const canCreatePeriod: boolean = Boolean(RootStore.WalletStore.wallets.length);

		return (
			<Root activeView='1'>
				<View id='1' popout={popout} activePanel={WalletsUI.activePanel} header={false} modal={modal}>
					<Panel id='1'>
						<PanelHeader title='Счета'/>
						<PullToRefresh onRefresh={UIStore.refreshPage} isFetching={RootStore.isFetching}>
							<Group header={<Header mode='primary'>Счета</Header>}>
								{wallets.length ? wallets.map(wallet => (
									<Cell
										key={wallet.id}
										removable
										onRemove={WalletsUI.showDelWalletConfirmation.bind(null, wallet)}
										indicator={wallet.value}
									>{wallet.title}</Cell>
								)) : <Div>У вас пока нет счетов.</Div>}
								<Cell><Link onClick={WalletsUI.setActiveModal.bind(null, "newWallet")}>Создать счёт</Link></Cell>
							</Group>
							<Group header={<Header mode='primary'>Периоды</Header>}>
								{(canCreatePeriod)
									? <Cell><Link onClick={WalletsUI.setActiveModal.bind(null, "newPeriod")}>Создать период</Link></Cell>
									: null
								}
								{periods.length ? periods.slice().sort((p1, p2) => (p2.startDate.getTime() - p1.startDate.getTime())).map((period) => (
									<Cell
										key={period.id}
										indicator={<Icon24BrowserForward/>}
										onClick={WalletsUI.periodClick.bind(null, period.id)}
									>
										<Card mode={(currPeriod && period.id === currPeriod.id) ? 'outline' : 'tint'}>
											<Div>{RootStore.dateHuman(period.startDate)} - {RootStore.dateHuman(period.endDate)}</Div>
											{period.walletsInited.map((w) => {
												console.log(w);
												return <Div
													key={w.wallet.id}
												>
													{w.wallet.title} - {w.sum} P {!w.isAddToBalance ? "(не в баланс)" : null}
												</Div>
											})}
											{(period.initStore) ? <Div>нач. накопления - {period.initStore} P</Div> : null}
										</Card>
									</Cell>
								)) : <Div>У вас пока нет
									Периодов. {((canCreatePeriod) ? null : "Для создания периодов необходимо создать хотя бы один счёт")}</Div>}
							</Group>
						</PullToRefresh>
					</Panel>
					<Panel id={"period"}>
						<PeriodPanel/>
					</Panel>
				</View>
			</Root>
		);
	}
}

export default Wallets
