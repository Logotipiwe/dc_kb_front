import ModalPageHeader from "@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import {Div, FormLayout, ModalPage} from "@vkontakte/vkui/dist";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {Icon24Cancel} from '@vkontakte/icons'
import React from "react";
import {inject, observer} from "mobx-react/dist";

@inject("RootStore")
@observer
class DelWalletModal extends React.Component<any, any> {
	render() {
		const RootStore = this.props.RootStore!;
		const {WalletsUI} = RootStore.UIStore;
		const {WalletStore} = RootStore;
		const wallet = this.props.wallet;
		return (
			<ModalPage
				id={'delWallet'}
				header={
					<ModalPageHeader
						left={<PanelHeaderButton
							onClick={WalletsUI.setActiveModal.bind(null, null)}><Icon24Cancel/></PanelHeaderButton>}
					>
						Удаление счёта
					</ModalPageHeader>
				}
			>
				<FormLayout>
					<Div>Вы действительно хотите удалить счёт {wallet.title}</Div>
					<Button size="xl" mode="commerce" onClick={WalletStore.delWallet.bind(null,wallet.id)}>Удалить счёт {wallet.title}</Button>
				</FormLayout>
			</ModalPage>
		)
	}
}
export default DelWalletModal;
