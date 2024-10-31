import {inject, observer} from "mobx-react/dist";
import React from "react";
import {LimitUi, NewLimit} from "../../../../stores/UIStore/WalletsUI";
import {withModalRootContext} from "@vkontakte/vkui";
import NewLimitItem from "./LimitItem";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import RootStore from "../../../../stores/RootStore";
import autoBind from "../../../../utils/autoBind";


type props = {
    list: LimitUi[]
    RootStore?: RootStore
}

@inject("RootStore")
@observer
class LimitsList extends React.Component<props, any> {
    constructor(props) {
        super(props);
        autoBind(this)
    }


    add(){
        this.props.list.push({amount: 0, type: "DAY"})
    }

    del(item: LimitUi){
        this.props.list.splice(this.props.list.indexOf(item),1)
    }
    render() {
        return <>
            {this.props.list.map((l: NewLimit, i)=>{
                return <NewLimitItem key={i} limit={l} onDelete={this.del}/>
            })}
            <Button onClick={this.add}>+ лимит</Button>
        </>
    }
}

export default withModalRootContext(LimitsList)