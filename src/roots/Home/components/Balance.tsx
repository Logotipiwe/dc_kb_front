import {inject, observer} from "mobx-react/dist";
import React from "react";
import {ICategory} from "../../../global";
import {Card, CardGrid} from "@vkontakte/vkui";
import {imgSrc} from "../../../utils/functions";
import RootStore from "../../../stores/RootStore";
import autoBind from "../../../utils/autoBind";
import {Div} from "@vkontakte/vkui/dist";

@inject("RootStore")
@observer
class Balance extends React.Component<{
    balance: Record<string, number>,
    category?: ICategory,
    RootStore?: RootStore
}, any> {
    render() {
        const category = this.props.category;
        const balances = this.props.balance;
        const rootStore = this.props.RootStore!;
        const analytics = rootStore.appData!.analytics;
        const balancesUi = rootStore.uiStore.balancesUi;
        const onRowClick = balancesUi.shiftDisplayMode.bind(null, this.props.category?.id);

        const mode = balancesUi.getDisplayModeByCatId(category?.id)

        if (mode === "row") {
            return <CardGrid onClick={onRowClick}>
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
        } else if(mode === "hidden") {
            return <div style={{margin: 5, display: "flex", flexDirection: "column", alignItems: "center"}}
                        onClick={onRowClick}
            >
                <div>
                    <img src={imgSrc(category!.img)} height={30}
                         style={{backgroundColor: category!.color, borderRadius: "50%", padding: 4, boxSizing: "border-box"}}
                    />
                </div>
                <div style={{borderRadius: "50%",
                    backgroundColor: rootStore.getColor(Object.values(balances)[0], 10000),
                    height: 10, width: 10
                }}/>
            </div>
        } else {
            return <>
                <Div>{category ? category.title : undefined}</Div>
                <CardGrid onClick={onRowClick}>
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
                                        }}>{balance}
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