import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import {
	Card,
	CardGrid,
	Cell,
	Div,
	Header, Root, View,
	PullToRefresh, CellButton
} from "@vkontakte/vkui/dist";

import PanelHeader from "../../PanelHeader";

import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";

@inject("RootStore")
@observer
class Home extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
	render() {
		const RootStore = this.props.RootStore!;
		const {appData, uiStore} = RootStore;

		const analytics = appData.analytics;
		const balances = RootStore.balances;
		const wallets = RootStore.walletStore.wallets;
		return (
			<Root activeView='1'>
				<View id='1' activePanel={'1'} header={false}>
					<Panel id='1'>
						<PanelHeader title='Главная'/>
						<PullToRefresh onRefresh={uiStore.refreshPage} isFetching={RootStore.isFetching}>
							{(analytics && balances) ?
								<Group separator="show" header={<Header mode="primary">Аналитика</Header>}>
									{!RootStore.isAllBalancesNull && <CardGrid>
										{Object.keys(balances).map(date => {
											const balance = balances[date];
											return <Card size='s' key={date}>
													<div style={{height: 76}}>
														{(balance !== null) &&
														<>
															<div style={{textAlign: 'center'}}>{RootStore.dateDiffHuman(date)}</div>
															<div style={{
																color: RootStore.getColor(balance),
																textAlign: 'center',
																paddingTop: 20,
																fontSize: 27
															}}>{balance} P
															</div>
														</>
														}
													</div>
												</Card>
										})}
									</CardGrid>}
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
