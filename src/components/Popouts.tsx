import {inject, observer} from "mobx-react/dist";
import React from "react";
import CategoriesPanel from "../roots/Transactions/components/CategoriesPanel";
import {SelectCatData} from "../stores/UIStore/popouts/PopoutsUi";
import {Alert} from "@vkontakte/vkui";


@inject("RootStore")
@observer
class Popouts extends React.Component<any, any> {

    render() {
        const rootStore = this.props.RootStore!;
        const popoutsUi = rootStore.uiStore.popoutsUi;
        const walletsUI = rootStore.uiStore.walletsUI;


        if(popoutsUi.selectCategoryPopoutData){
            const data: SelectCatData = popoutsUi.selectCategoryPopoutData;
            return <CategoriesPanel
                categories={data.categoriesToShow}
                selectedCategory={data.selectedCategory}
                onSelect={data.onSelect}
                onClose={popoutsUi.closeSelectCategoryPopup}
            />
        }
        if(popoutsUi.deletingPeriod){
            return <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Удалить период',
                    autoclose: true,
                    mode: 'destructive',
                    action: walletsUI.periodDelete.bind(null, popoutsUi.deletingPeriod),
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                onClose={popoutsUi.setDeletingPeriod.bind(null, undefined)}
            >
                <h2>Удалить период
                    с {rootStore.dateHuman(popoutsUi.deletingPeriod!.startDate)} по {rootStore.dateHuman(popoutsUi.deletingPeriod!.endDate)}?</h2>
            </Alert>
        }
        return null
    }
}

export default Popouts