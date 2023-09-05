import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import {
	Card,
	CardGrid,
	Cell,
	Header, Root, View,
	PullToRefresh, CellButton, Div
} from "@vkontakte/vkui/dist";

import PanelHeader from "../../PanelHeader";

import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";
import {imgSrc} from "../../utils/functions";
import Balance from "./components/Balance";

@inject("RootStore")
@observer
class Home extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
	render() {
		const rootStore = this.props.RootStore!;
		const {uiStore} = rootStore;
		const appData = rootStore.appData!;

		const analytics = appData.analytics;
		const balances = rootStore.balances;
		const periodBalances = appData.limit_balances;
		const wallets = rootStore.walletStore.wallets;
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
											{Object.entries(periodBalances).map(periodBalance=> {
												const categoryId = parseInt(periodBalance[0])
												const category = rootStore.transactionsStore.categories[categoryId]
												return <Balance balance={periodBalance[1]} category={category}/>
											})}
                                        </>}
                                    {(analytics.per_day !== null) && <Cell indicator={analytics.per_day + ' P'}>В день: </Cell>}
									<Cell indicator={analytics.value_real_left + ' P'}>Остаток: </Cell>
									{(analytics.stored !== null && analytics.invested !== null) &&
										<Cell indicator={(analytics.stored - analytics.invested) + ' P'}>Накопления: </Cell>
									}
								</Group> : <CellButton>Создать новый период</CellButton>}
							<Group header={<Header mode='primary'>Счета</Header>}>
								{wallets.length ? wallets.map(wallet => (
									<Cell
										key={wallet.id}
										indicator={wallet.value + ' P'}
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
