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
import CategoriesPanel from "../Transactions/components/CategoriesPanel";
import transactionsStore from "../../stores/TransactionsStore";
import Popouts from "../../components/Popouts";
import {fmt} from "../../utils/functions";

@inject("RootStore")
@observer
class Wallets extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
	componentDidMount() {
		if (process.env.NODE_ENV === "development") {
			const RootStore = this.props.RootStore!;
			const walletsUI = RootStore.uiStore.walletsUI;
			// walletsUI.activeModal = "newPeriod"
			// walletsUI.newPeriodStartDate = '2023-09-01'
			// walletsUI.newPeriodEndDate = '2023-09-30'
			// walletsUI.periodSelected = RootStore.periodStore.getPeriod(134)
		}
	}

	render() {
		const RootStore = this.props.RootStore!;
		const {uiStore, periodStore, transactionsStore} = RootStore;
		const {walletsUI} = uiStore;

		const wallets = RootStore.walletStore.wallets;
		const periods = RootStore.periodStore.periods;

		const currPeriod = periodStore.currPeriod;

		const modal = (
			<ModalRoot activeModal={walletsUI.activeModal}>
				<NewWalletModal
					id={'newWallet'}
					dynamicContentHeight
					onClose={walletsUI.setActiveModal.bind(null, null)}
				/>
				<DelWalletModal
					id={'delWallet'}
					wallet={walletsUI.deletingWallet!}
					onClose={walletsUI.setActiveModal.bind(null, null)}
				/>
				<NewPeriodModal
					id={'newPeriod'}
					dynamicContentHeight
					onClose={walletsUI.onNewPeriodModalClose}
				/>
			</ModalRoot>
		);
		const canCreatePeriod: boolean = Boolean(RootStore.walletStore.wallets.length);
		return (
			<Root activeView='1'>
				<View id='1' popout={uiStore.popoutsUi.isShowing() && <Popouts/>} activePanel={walletsUI.activePanel} header={false} modal={modal}>
					<Panel id='1'>
						<PanelHeader title='Счета'/>
						<PullToRefresh onRefresh={uiStore.refreshPage} isFetching={RootStore.isFetching}>
							<Group header={<Header mode='primary'>Счета</Header>}>
								{wallets.length ? wallets.map(wallet => (
									<Cell
										key={wallet.id}
										removable
										onRemove={walletsUI.showDelWalletConfirmation.bind(null, wallet)}
										indicator={fmt(wallet.value)}
									>{wallet.title}</Cell>
								)) : <Div>У вас пока нет счетов.</Div>}
								<Cell><Link onClick={walletsUI.setActiveModal.bind(null, "newWallet")}>Создать счёт</Link></Cell>
							</Group>
							<Group header={<Header mode='primary'>Периоды</Header>}>
								{(canCreatePeriod)
									? <Cell><Link onClick={walletsUI.setActiveModal.bind(null, "newPeriod")}>Создать период</Link></Cell>
									: null
								}
								{periods.length ? periods.slice().sort((p1, p2) => (p2.startDate.getTime() - p1.startDate.getTime())).map((period) => (
									<Cell
										key={period.id}
										indicator={<Icon24BrowserForward/>}
										onClick={walletsUI.periodClick.bind(null, period.id)}
									>
										<Card mode={(currPeriod && period.id === currPeriod.id) ? 'outline' : 'tint'}>
											<Div>{RootStore.dateHuman(period.startDate)} - {RootStore.dateHuman(period.endDate)}</Div>
											{period.walletsInited.map((w) => {
												return <Div
													key={w.wallet.id}
												>
													{w.wallet.title} - {fmt(w.sum)} {!w.isAddToBalance ? "(не в баланс)" : null}
												</Div>
											})}
											{(period.initStore) ? <Div>нач. накопления - {fmt(period.initStore)}</Div> : null}
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
