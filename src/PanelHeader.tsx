import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";
import PanelHeaderContent from "@vkontakte/vkui/dist/components/PanelHeaderContent/PanelHeaderContent";
import {PanelHeaderSimple} from "@vkontakte/vkui/dist";
import {Icon24BrowserForward} from '@vkontakte/icons';
import {Icon24BrowserBack} from '@vkontakte/icons';
import {Icon24Repost} from '@vkontakte/icons';
import React from "react";
import {inject, observer} from "mobx-react/dist";
import RootStore from "./stores/RootStore";

@inject("RootStore")
@observer
class PanelHeader extends React.Component<{RootStore? : RootStore, title: string}, any>{
    render() {
        const RootStore = this.props.RootStore!;
        const title = this.props.title;
        return (
            <PanelHeaderSimple
                left={[
                    <PanelHeaderButton
                        key='1'
                        onClick={RootStore.currDateChange.bind(null, -1)}
                    ><Icon24BrowserBack/></PanelHeaderButton>,
                    <PanelHeaderButton
                        key='2'
                        onClick={RootStore.currDateChange.bind(null, 1)}
                    ><Icon24BrowserForward/></PanelHeaderButton>,
                  <PanelHeaderButton
                    key='3'
                    onClick={RootStore.setCurrDateToday}
                  ><Icon24Repost/></PanelHeaderButton>
                ]}
            >
                <PanelHeaderContent status={"за " + RootStore.dateHuman()} aside='' before=''>
                  {title}
                </PanelHeaderContent>
            </PanelHeaderSimple>
        );
    }
}
export default PanelHeader
