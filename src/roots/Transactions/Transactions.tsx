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
		const RootStore = this.props.RootStore!;
		const {transactionsUI: transactionsUI} = RootStore.uiStore;
		const {transactionsStore: transactionsStore} = RootStore;
		const {categories, transactions} = transactionsStore;
		const {availableToWallets} = RootStore.walletStore;
		const currentBalance = Object.values(RootStore.balances!)[0];

		const categoriesToShow = transactionsStore.categoriesToShow;

		const chunkSize = 4;
		const categoriesChunked = categoriesToShow.map((x, i) => categoriesToShow
			.slice(i * chunkSize, i * chunkSize + chunkSize))
			.filter(arr => arr.length);

		const transValType = transactionsUI.selectedTransValueType;
		const valueFieldTitle = (transValType === 'transValue') ? 'Сумма' : "Сумма на счету";
		const selectedButtonStyle = {
			backgroundColor: 'var(--accent)',
			color: 'white'
		};

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
							{transactionsUI.selectedType !== 4 && <FormField style={{flexGrow: 1}}>
								<WalletSelect/>
							</FormField>}
							{transValType === 'transValue' ? <FormField style={{flexGrow: 1}}>
								<TypeSelect/>
							</FormField> : null}
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
							onClick={transactionsUI.openCatSelectPopout}
						/>}
						<Button size="xl" mode="commerce" disabled={RootStore.isFetching} onClick={transactionsStore.newTrans}>
							{(RootStore.isFetching)
								? <Spinner size="small"/>
								: "Добавить транзакцию"
							}
						</Button>
					</FormLayout>
				</ModalPage>
			</ModalRoot>
		);
		const popout = (transactionsUI.popout == null) ? null : (
			<Panel>
				<PanelHeaderSimple>Выбор категории</PanelHeaderSimple>
				<Group>
					<Header
						onClick={transactionsUI.setPopout.bind(null, null)} aside={<Icon24Cancel/>} style={{margin: '15 0'}}
					>Назад</Header>
					{transactionsUI.isShowingRootCats ? null
						: <Button
							size={'l'}
							style={{width: "calc(100% - 20px)", margin: "10px"}}
							onClick={transactionsUI.setPopout.bind(null, null)}
						>Без подкатегории</Button>}

					{categoriesChunked.map((chunk, i) =>
						<CardGrid key={i}>
							{chunk.map(category => {
								const category_id = category.id;
								return <Card
									className={"category_card_outer"}
									key={category_id}
									size={'s'}
									style={transactionsUI.selectedCategory?.id === category_id ? {backgroundColor: "var(--tabbar_tablet_active_icon)"} : {}}
									onClick={transactionsUI.selectCat.bind(null, category_id)}
								>
									<div className="category_card">
										<div className="img" style={{backgroundColor: category.color}}>
											<img src={category.img} alt='.'/>
										</div>
										{category.title}
									</div>
								</Card>

							})}
						</CardGrid>
					)}
					{
						(transactionsUI.transactionDiff < 0 && transactionsUI.isShowingRootCats)
						&& <Checkbox
							checked={transactionsUI.isUnnecessary}
							onChange={transactionsUI.changeIsUnnecessary}
						>Необязательный</Checkbox>
					}
				</Group>
			</Panel>
		);

		return (
			<Root activeView='1'>

				<View id='1' activePanel='1' popout={popout} modal={modal}
				      header={false}>
					<Panel id='1'>
						<PanelHeader title='Транзакции'/>
						<PullToRefresh onRefresh={RootStore.uiStore.refreshPage} isFetching={RootStore.isFetching}>
							{transactions ? transactions.map(trans => {
								const type = transactionsStore.getType(trans.type);
								return (
									<Cell
										key={trans.id}
										removable
										onRemove={RootStore.delTransaction.bind(null, trans.id)}
										indicator={trans.title + (trans.to_title ? ('->' + trans.to_title) : '')}
										description={type.title + ((trans.category !== null) ? ' на ' + categories[trans.category].title.toLowerCase() : '') + (trans.is_unnecessary ? ' (необяз.)' : '')}
									>{trans.value} P</Cell>
								)
							}) : <Spinner size='large'/>}
							{(currentBalance > 0) && <CellButton
								onClick={transactionsUI.storeMoneyLeft.bind(null, currentBalance)}
							>{currentBalance}р в накопления</CellButton>}
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
