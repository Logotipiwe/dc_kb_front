import * as React from 'react';
import {Epic, Tabbar, TabbarItem} from '@vkontakte/vkui/dist'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import {Icon28HomeOutline} from '@vkontakte/icons';
import {Icon28ListAddOutline} from '@vkontakte/icons';
import {Icon28ListOutline} from '@vkontakte/icons';
import {Icon28WalletOutline} from '@vkontakte/icons';
import {Icon28GraphOutline} from '@vkontakte/icons';
import Home from "./roots/Home/Home";
import Transactions from "./roots/Transactions/Transactions";
import Menu from "./roots/Menu/Menu";
import Login from './Login'
import {inject, observer} from "mobx-react/dist";
import RootStore from './stores/RootStore'
import Wallets from "./roots/Wallets/Wallets";
import Analytics from "./roots/Analytics/Analytics";

@inject('RootStore')
@observer
class App extends React.Component<{ RootStore?: RootStore }, {}> {
	componentDidMount(): void {
		this.props.RootStore!.auth = false;
		this.props.RootStore!.dataLoaded = true;
		// this.props.RootStore!.fetchData();
		// const schemeAttribute = document.createAttribute('scheme');
		// schemeAttribute.value = 'space_gray';
		// document.body.attributes.setNamedItem(schemeAttribute);
	}

	render(): React.ReactElement {
		const RootStore = this.props.RootStore!;
		const {uiStore} = RootStore;

		if (!RootStore.dataLoaded) return <ScreenSpinner/>;
		if (!RootStore.auth) return <Login/>;

		const screens: Record<string, Record<"tabbarTitle" | "tabbarIcon" | "view" | "condition", any>> = {
			home: {
				tabbarTitle: "Главная",
				tabbarIcon: <Icon28HomeOutline/>,
				view: <Home key='home' id={'home'}/>,
				condition: true
			},
			wallets: {
				tabbarTitle: "Счета",
				tabbarIcon: <Icon28WalletOutline/>,
				view: <Wallets key='wallets' id='wallets'/>,
				condition: true
			},
			transactions: {
				tabbarTitle: "Транзакции",
				tabbarIcon: <Icon28ListAddOutline/>,
				view: <Transactions id={'transactions'} key={'transactions'}/>,
				condition: (RootStore.walletStore.wallets.length)
			},
			analytics: {
				tabbarTitle: "Аналитика",
				tabbarIcon: <Icon28GraphOutline/>,
				view: <Analytics id='analytics' key='analytics'/>,
				condition: true
			},
			menu: {
				tabbarTitle: "Меню",
				tabbarIcon: <Icon28ListOutline/>,
				view: <Menu id={'menu'} key={'menu'}/>,
				condition: true
			}
		};

		return (
			<Epic activeStory={uiStore.activeStory} tabbar={
				<Tabbar>
					{Object.keys(screens).map(screenTitle => {
						const screen = screens[screenTitle];
						if (!screen.condition) return null;
						return <TabbarItem
							key={screenTitle}
							onClick={uiStore.onStoryChange}
							selected={uiStore.activeStory === screenTitle}
							data-story={screenTitle}
							text={screen.tabbarTitle}
						>{screen.tabbarIcon || ''}</TabbarItem>
					})}
				</Tabbar>
			}>
				{RootStore.dataLoaded ? Object.keys(screens).map(screenTitle => {
					return screens[screenTitle].view;
				}) : <ScreenSpinner/>}
			</Epic>
		)
	}
}

export default App;
