import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import {Cell, CellButton, Div, Header, PullToRefresh, Root, View} from "@vkontakte/vkui/dist";

import PanelHeader from "../../PanelHeader";

import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";
import Balance from "./components/Balance";
import {fmt} from "../../utils/functions";

@inject("RootStore")
@observer
class Home extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
	render() {
		const rootStore = this.props.RootStore!;
		const {uiStore} = rootStore;
		const appData = rootStore.appData!;

		const analytics = appData.analytics;
		const balances = rootStore.balances;
		const wallets = rootStore.walletStore.wallets;
		const periodBalances = appData.limit_balances;

		const balancesToShow: any[] = [];
		const balancesToHide: any[] = [];

		Object.entries(periodBalances).forEach(catIdToBalance=>{
			if(uiStore.balancesUi.isBalanceShown(parseInt(catIdToBalance[0]))){
				balancesToShow.push(catIdToBalance)
			} else {
				balancesToHide.push(catIdToBalance);
			}
		})

		const initStore = rootStore.periodStore.currPeriod?.initStore
		const stored = analytics.stored - analytics.invested;

		return (
			<Root activeView='1'>
				<View id='1' activePanel={'1'} header={false}>
					<Panel id='1'>
						<PanelHeader title='Главная'/>
						<PullToRefresh onRefresh={uiStore.refreshPage} isFetching={rootStore.isFetching}>
							{(analytics && balances) ?
								<Group separator="show" header={<Header mode="primary">Аналитика</Header>}>
									{!rootStore.isAllBalancesNull
                                        && <>
											<Balance balance={balances}/>
											{balancesToShow.map(periodBalance=> {
												const categoryId = parseInt(periodBalance[0])
												const category = rootStore.transactionsStore.categories[categoryId]
												return <Balance balance={periodBalance[1]} category={category}/>
											})}
											<div style={{display: "flex", padding: 12, flexWrap: "wrap"}}>
												{balancesToHide.map(periodBalance=> {
													const categoryId = parseInt(periodBalance[0])
													const category = rootStore.transactionsStore.categories[categoryId]
													return <Balance balance={periodBalance[1]} category={category}/>
												})}
											</div>
                                        </>}
                                    {(analytics.per_day !== null) && <Cell indicator={fmt(analytics.per_day)}>В день: </Cell>}
									<Cell indicator={fmt(analytics.value_real_left)}>Остаток: </Cell>
									{(analytics.stored !== null && analytics.invested !== null) &&
										<Cell indicator={
											(initStore ? ` ${fmt(stored - initStore)} ` : "") + `(${fmt(stored)})`
										}>Накопления: </Cell>
									}
								</Group> : <CellButton>Создать новый период</CellButton>}
							<Group header={<Header mode='primary'>Счета</Header>}>
								{wallets.length ? wallets.map(wallet => (
									<Cell
										key={wallet.id}
										indicator={fmt(wallet.value)}
									>{wallet.title}</Cell>
								)) : <Div>У вас пока нет счетов.</Div>}
							</Group>
						</PullToRefresh>
					</Panel>
				</View>
			</Root>
		);
	}
}

export default Home
