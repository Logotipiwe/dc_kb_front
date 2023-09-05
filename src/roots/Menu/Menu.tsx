import React from 'react';
import {Cell, Header, PullToRefresh, Root, View} from "@vkontakte/vkui/dist";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";
import PanelHeader from "../../PanelHeader";

@inject("RootStore")
@observer
class Menu extends React.Component<{ RootStore?: RootStore, id: any, key: any }, {}> {
	render() {
		const RootStore = this.props.RootStore!;
		return (
			<Root activeView='1'>
				<View id='1' activePanel='1' header={false}>
					<Panel id='1'>
						<PanelHeader title='Меню'/>
						<PullToRefresh onRefresh={RootStore.uiStore.refreshPage} isFetching={RootStore.isFetching}>
							<Group header={<Header mode="secondary">Выход</Header>}>
								<Cell>
									<div
										style={{color: 'red', textDecoration: 'underline', fontSize: 23}}
										onClick={RootStore.logout}
									>
										Выйти
									</div>
								</Cell>
							</Group>
						</PullToRefresh>
					</Panel>
				</View>
			</Root>
		);
	}
}

export default Menu
