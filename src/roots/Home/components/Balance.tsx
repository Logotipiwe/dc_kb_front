import {inject, observer} from "mobx-react/dist";
import React from "react";
import {ICategory} from "../../../global";
import {Card, CardGrid} from "@vkontakte/vkui";
import {imgSrc} from "../../../utils/functions";
import RootStore from "../../../stores/RootStore";
import autoBind from "../../../utils/autoBind";
import {Div} from "@vkontakte/vkui/dist";


type DisplayModes = "big" | "row";
const KEY: string = "displayBalanceInCategory:"

@inject("RootStore")
@observer
class Balance extends React.Component<{
    balance: Record<string, number>,
    category?: ICategory,
    RootStore?: RootStore
}, { display: DisplayModes }> {
    constructor(props) {
        super(props);
        autoBind(this)
        const key = this.getStorageKey(props.category);
        const value = localStorage.getItem(key);
        if (value === "big" || value === "row") {
            this.state = {display: value};
        } else {
            const display = props.category ? "row" : "big";
            this.state = {display: display};
            localStorage.setItem(key, display)
        }
    }

    private getStorageKey(category?: ICategory) {
        return KEY + (category?.id || "null");
    }

    shiftDisplayMode() {
        const newMode = this.state.display === "big" ? "row" : "big";
        this.setNewDisplayMode(newMode)
    }

    setNewDisplayMode(mode: DisplayModes) {
        this.setState({display: mode})
        localStorage.setItem(this.getStorageKey(this.props.category), mode);
    }

    render() {
        const category = this.props.category;
        const balances = this.props.balance;
        const rootStore = this.props.RootStore!;
        const analytics = rootStore.appData!.analytics;

        if (this.state.display === "row") {
            return <CardGrid onClick={this.shiftDisplayMode}>
                <Card size="l" style={{padding: "8px 10px", boxSizing: "border-box"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    <span style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 17
                    }}>
                        {category
                            ? <><img src={imgSrc(category.img)} height={20} width={20}
                                     style={{
                                         borderRadius: '50%',
                                         backgroundColor: category.color,
                                         padding: 4
                                     }}/> {category.title}</>
                            : "Общий:"
                        }
                    </span>
                        <div style={{display: "flex", flexBasis: "50%", justifyContent: "space-between", fontSize: 20}}>
                            {Object.values(balances).map(amount => {
                                return <span style={{
                                    color: rootStore.getColor(amount, 1000),
                                    marginRight: 10
                                }}>{amount}</span>
                            })}
                        </div>
                    </div>
                </Card>
            </CardGrid>;
        } else {
            return <>
                <Div>{category ? category.title : undefined}</Div>
                <CardGrid onClick={this.shiftDisplayMode}>
                    {Object.keys(balances).map(date => {
                        const balance = balances[date];
                        return <Card size='s' key={date}>
                            <div style={{height: 76}}>
                                {(balance !== null) &&
                                    <>
                                        <div
                                            style={{textAlign: 'center'}}>{rootStore.dateDiffHuman(date)}</div>
                                        <div style={{
                                            color: rootStore.getColor(balance, analytics.per_day),
                                            textAlign: 'center',
                                            paddingTop: 20,
                                            fontSize: 27
                                        }}>{balance} P
                                        </div>
                                    </>
                                }
                            </div>
                        </Card>
                    })}
                </CardGrid>
            </>
        }

    }
}

export default Balance;