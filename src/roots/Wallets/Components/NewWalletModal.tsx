import ModalPageHeader from "@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import {FormLayout, Input, ModalPage} from "@vkontakte/vkui/dist";
import FormStatus from "@vkontakte/vkui/dist/components/FormStatus/FormStatus";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {Icon24Cancel} from '@vkontakte/icons'
import React from "react";
import {inject, observer} from "mobx-react/dist";

@inject("RootStore")
@observer
class NewWalletModal extends React.Component<any, any> {
    render() {
        const {WalletsUI} = this.props.RootStore!.UIStore;
        return (
            <ModalPage
                id={'newWallet'}
                header={
                    <ModalPageHeader
                        left={<PanelHeaderButton
                            onClick={WalletsUI.setActiveModal.bind(null, null)}><Icon24Cancel/></PanelHeaderButton>}
                    >
                        Новый счёт
                    </ModalPageHeader>
                }
            >
                <FormLayout>
                    {WalletsUI.showErr && <FormStatus header="Ошибка ввода данных" mode="error">
											Проверьте правильность полей.
										</FormStatus>}
                    <Input
                        top='Название'
                        placeholder='Название...'
                        onChange={WalletsUI.changeInputWalletTitle}
                        value={WalletsUI.inputWalletTitle}
                    />
                    <Button size="xl" mode="commerce" onClick={WalletsUI.newWallet}>Добавить счёт</Button>

                </FormLayout>
            </ModalPage>
        )
    }
}
export default NewWalletModal;
