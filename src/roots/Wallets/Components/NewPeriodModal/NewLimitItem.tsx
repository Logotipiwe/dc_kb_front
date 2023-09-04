import {inject, observer} from "mobx-react/dist";
import React from "react";
import {NewLimit} from "../../../../stores/UIStore/WalletsUI";
import {Div, Input, SelectMimicry} from "@vkontakte/vkui/dist";
import RootStore from "../../../../stores/RootStore";
import {withModalRootContext} from "@vkontakte/vkui";
import {Icon24Cancel} from "@vkontakte/icons";

type Props = { limit: NewLimit, RootStore?: RootStore };

@inject("RootStore")
@observer
class NewLimitItem extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const newLimitItem = this.props.limit;
        const rootStore = this.props.RootStore!;
        const walletsUi = rootStore.uiStore.walletsUI;
        let daysCount = walletsUi.daysCount;
        return <Div>
            <div style={{display: "flex", alignItems: "center"}}>
                <SelectMimicry
                    style={{display: "flex", flexGrow: "1"}}
                    placeholder={newLimitItem.category ? newLimitItem.category.title : "Кат-я..."}
                    onClick={walletsUi.setLimitForSelectCategory.bind(null, newLimitItem)}
                />
                <Input
                    type='number'
                    style={{width: 100}}
                    value={newLimitItem.amount || ""}
                    onChange={e => newLimitItem.amount = parseInt(e.target.value) || 0}
                />
                <Icon24Cancel onClick={walletsUi.removeNewLimit.bind(null, newLimitItem)}/>
            </div>
            {daysCount ? <span
                style={{color: "var(--text_secondary)", marginLeft: 15}}
            >В день: {Math.round(newLimitItem.amount/daysCount)}</span> : null}
        </Div>
    }
}

export default withModalRootContext(NewLimitItem)