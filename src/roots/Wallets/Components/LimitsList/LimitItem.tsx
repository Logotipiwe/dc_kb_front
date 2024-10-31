import {inject, observer} from "mobx-react/dist";
import React from "react";
import {LimitUi, NewLimit} from "../../../../stores/UIStore/WalletsUI";
import {Div, Input, SelectMimicry} from "@vkontakte/vkui/dist";
import RootStore from "../../../../stores/RootStore";
import {Checkbox, withModalRootContext} from "@vkontakte/vkui";
import {Icon24Cancel} from "@vkontakte/icons";
import {ICategory} from "../../../../global";

type Props = { limit: NewLimit,
    onDelete: (l: LimitUi)=>void,
    RootStore?: RootStore,
};

@inject("RootStore")
@observer
class LimitItem extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const limitItem = this.props.limit;
        const rootStore = this.props.RootStore!;
        let uiStore = rootStore.uiStore;
        const walletsUi = uiStore.walletsUI;
        let daysCount = walletsUi.daysCount;

        const onSelectCategoryClick = e=>uiStore.popoutsUi.openSelectCategoryPopup(
            rootStore.transactionsStore.outcomeCategories,
            limitItem.category,
            category=>limitItem.category = category
        );

        return <Div>
            <div style={{display: "flex", alignItems: "center"}}>
                <SelectMimicry
                    style={{display: "flex", flexGrow: "1"}}
                    placeholder={limitItem.category ? limitItem.category.title : "Кат-я..."}
                    onClick={onSelectCategoryClick}
                />
                <Input
                    type='number'
                    style={{width: 100}}
                    value={limitItem.amount || ""}
                    onChange={e => limitItem.amount = parseInt(e.target.value) || 0}
                />
                <Icon24Cancel onClick={e=>this.props.onDelete(limitItem)}/>
            </div>
            <Checkbox
                checked={limitItem.type === "DAY"}
                onChange={e=>{limitItem.type = e.target.checked ? "DAY" : "PERIOD"}}
            >По дням</Checkbox>
            {(daysCount && limitItem.type === "DAY") ? <span
                style={{color: "var(--text_secondary)", marginLeft: 15}}
            >В день: {Math.round(limitItem.amount/daysCount)}</span> : null}
        </Div>
    }
}

export default withModalRootContext(LimitItem)