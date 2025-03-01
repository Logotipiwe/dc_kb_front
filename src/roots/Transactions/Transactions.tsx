import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import {Icon24Cancel} from '@vkontakte/icons'
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import {
	Card,
	CardGrid,
	Checkbox,
	Div,
	FormLayout,
	Input,
	ModalPage,
	ModalRoot,
	PanelHeaderSimple,
	PullToRefresh,
	Root,
	Select,
	SelectMimicry,
	Spinner,
	View
} from "@vkontakte/vkui/dist";
import CellButton from "@vkontakte/vkui/dist/components/CellButton/CellButton";
import ModalPageHeader from "@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import FormStatus from "@vkontakte/vkui/dist/components/FormStatus/FormStatus";

import './Transactions.scss'
import {inject, observer} from "mobx-react/dist";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
import RootStore from "../../stores/RootStore";
import PanelHeader from "../../PanelHeader";
import {ValueInput} from "./components/ValueInput";
import FormField from "@vkontakte/vkui/dist/components/FormField/FormField";
import {TypeSelect} from "./components/TypeSelect";
import {WalletSelect} from "./components/WalletSelect";
import CategoriesPanel from "./components/CategoriesPanel";
import rootStore from "../../stores/RootStore";
import Popouts from "../../components/Popouts";
import {fmt} from "../../utils/functions";
import { WalletFastClickItem } from './components/WalletFastClickItem';
import {TypeFastClickItem} from "./components/TypeFastClickItem";

@inject('RootStore')
@observer
class Transactions extends React.Component<{ RootStore?: RootStore, id: any, key: any }, any> {

	componentDidMount(): void {
		const {transactionsUI} = this.props.RootStore!.uiStore;
		const {wallets} = this.props.RootStore!.walletStore;
		if (transactionsUI.selectedWallet === null) {
			transactionsUI.selectedWallet = wallets[0];
		}
	}

	render() {
		const rootStore = this.props.RootStore!;
		let uiStore = rootStore.uiStore;
		const {transactionsUI} = uiStore;
		const {transactionsStore} = rootStore;
		const {categories, transactions} = transactionsStore;
		const {availableToWallets, wallets} = rootStore.walletStore;
		const currentBalance = Object.values(rootStore.balances!)[0];

		const transValType = transactionsUI.selectedTransValueType;
		const valueFieldTitle = (transValType === 'transValue') ? 'Сумма' : "Сумма на счету";
		const selectedButtonStyle = {
			backgroundColor: 'var(--accent)',
			color: 'white'
		};

		const onSelectCategoryClick = e=>uiStore.popoutsUi.openSelectCategoryPopup(
			rootStore.transactionsStore.categoriesToShow,
			transactionsUI.selectedCategory,
			transactionsUI.selectCat
		);

		const modal = (
			<ModalRoot activeModal={(transactionsUI.activeModal)}>
				<ModalPage
					id={'newTrans'}
					onClose={transactionsUI.setActiveModal.bind(null, null)}
					dynamicContentHeight
					header={
						<ModalPageHeader left={
							<PanelHeaderButton onClick={transactionsUI.setActiveModal.bind(null, null)}>
								<Icon24Cancel/>
							</PanelHeaderButton>
						}>Новая транзакция
						</ModalPageHeader>
					}
				>
					<FormLayout>
						<Div style={{display: 'flex', padding: '0'}}>
							<Button
								size="m"
								stretched
								mode="secondary"
								style={(transValType === 'transValue') ? selectedButtonStyle : {}}
								onClick={transactionsUI.selectTransValueType.bind(null, "transValue")}
							>Транзакция</Button>
							<Button
								size="m"
								stretched
								mode="secondary"
								style={(transValType === 'walletValue') ? selectedButtonStyle : {}}
								onClick={transactionsUI.selectTransValueType.bind(null, "walletValue")}
							>Значение счёта</Button>
						</Div>
						{transactionsUI.isShowErr && <FormStatus header="Ошибка ввода данных" mode="error">
							Проверьте правильность полей.
						</FormStatus>}

						<div style={{display: "flex"}}>
							{transactionsUI.selectedType !== 4 && <div
								style={{display: 'flex', flexDirection: "column", flexGrow: 1}}
							>
								<FormField>
									<WalletSelect/>
								</FormField>
								<div style={{display: "flex", margin: "0 10px", justifyContent: "space-around"}}>
									{wallets.map((w, i) => {
										return <WalletFastClickItem
											key={w.id}
											i={i}
											wallet={w}
										/>
									})}
								</div>
							</div>
							}
							{transValType === 'transValue' ?
								<div style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
									<FormField>
										<TypeSelect/>
									</FormField>
									<div style={{display: "flex", margin: "0 10px", justifyContent: "space-around"}}>
										{transactionsStore.types.map((t, i) => {
											return <TypeFastClickItem
												key={t.id}
												i={i}
												type={t}
											/>
										})}
									</div>
								</div> : null}
						</div>

						<FormField top={valueFieldTitle}>
							<ValueInput/>
						</FormField>

						{(transactionsUI.transactionDiff > 0 || transactionsUI.selectedType === 3)
							&& <Checkbox
								checked={transactionsUI.isAddToBalance}
								onChange={transactionsUI.changeIsAddToBalance}
						>Зачислить в баланс</Checkbox>
						}
						{(transactionsUI.selectedTransValueType === "walletValue" && transactionsUI.transactionDiff < 0) &&
						<Checkbox
							checked={transactionsUI.isNewValueAsInvest}
							onChange={transactionsUI.changeIsNewValueAsInvest}
						>Вложение</Checkbox>
						}
						{transactionsUI.selectedType === 2 &&
						<Select
							value={transactionsUI.selectedToWallet!}
							onChange={transactionsUI.changeWalletTo}
							top='Счет зачисления'
						>
							{availableToWallets.map(wallet =>
								<option value={wallet.id} key={wallet.id}>
									{wallet.title}
								</option>
							)}
						</Select>}
						{(transactionsStore.categoriesToShow.length || transactionsUI.selectedCategory) && <SelectMimicry
							top={'Категория'}
							placeholder={!transactionsUI.selectedCategory ? 'выбрать...' : transactionsUI.selectedCategory.title}
							onClick={onSelectCategoryClick}
						/>}
						<Button size="xl" mode="commerce" disabled={rootStore.isFetching} onClick={transactionsStore.newTrans}>
							{(rootStore.isFetching)
								? <Spinner size="small"/>
								: "Добавить транзакцию"
							}
						</Button>
					</FormLayout>
				</ModalPage>
			</ModalRoot>
		);

		return (
			<Root activeView='1'>

				<View id='1' activePanel='1' popout={uiStore.popoutsUi.isShowing() && <Popouts/>} modal={modal}
				      header={false}>
					<Panel id='1'>
						<PanelHeader title='Транзакции'/>
						<PullToRefresh onRefresh={uiStore.refreshPage} isFetching={rootStore.isFetching}>
							{transactions ? transactions.map(trans => {
								const type = transactionsStore.getType(trans.type);
								return (
									<Cell
										key={trans.id}
										removable
										onRemove={rootStore.delTransaction.bind(null, trans.id)}
										indicator={trans.title + (trans.to_title ? ('->' + trans.to_title) : '')}
										description={type.title + ((trans.category !== null) ? ' на ' + categories[trans.category].title.toLowerCase() : '') + (trans.is_unnecessary ? ' (необяз.)' : '')}
									>{fmt(trans.value)}</Cell>
								)
							}) : <Spinner size='large'/>}
							{(currentBalance > 0) && <CellButton
								onClick={transactionsUI.storeMoneyLeft.bind(null, currentBalance)}
							>{fmt(currentBalance)} в накопления</CellButton>}
							{transactionsUI.isShowSetFinalSumButton() ? <CellButton
								onClick={rootStore.isFetching ? undefined : transactionsStore.setFinalSumDate}
								style={{color: 'green'}}
							>Закрепить сумму</CellButton> : null}
							<CellButton
								onClick={transactionsUI.setActiveModal.bind(null, "newTrans")}
							>Добавить новую транзакцию</CellButton>
						</PullToRefresh>
					</Panel>
				</View>
			</Root>
		);
	}
}

export default Transactions
