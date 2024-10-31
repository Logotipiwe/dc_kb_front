import {inject, observer} from "mobx-react/dist";
import React from "react";
import {ICategory, DateToBalance} from "../../../global";
import {Card, CardGrid} from "@vkontakte/vkui";
import {fmtBalance, imgSrc} from "../../../utils/functions";
import RootStore from "../../../stores/RootStore";
import {Div} from "@vkontakte/vkui/dist";
import {number, string} from "prop-types";

@inject("RootStore")
@observer
class Balance extends React.Component<{
    balance: DateToBalance,
    category?: ICategory,
    RootStore?: RootStore
}, any> {
    render() {
        const category = this.props.category;
        const balances = this.props.balance;
        const rootStore = this.props.RootStore!;
        const analytics = rootStore.appData!.analytics;
        const balancesUi = rootStore.uiStore.balancesUi;
        const isBalanceByPeriod = !!balances.PERIOD
        const onRowClick = balancesUi.shiftDisplayMode.bind(null, this.props.category?.id, isBalanceByPeriod);

        const mode = balancesUi.getDisplayModeByCatId(category?.id)

        let balancesValues = Object.values(balances)

        const firstValuable = Object.values(balances).filter(x=>x)[0] || 0

        const perDay = category
            ? balancesValues.length > 1 //впадлу высчитывать это правильно на бэке в случае лимитов на категории
                ? (balancesValues[1]||0) - (balancesValues[0]||0)
                : analytics.per_day
            : analytics.per_day;

        if (mode === "row" || (mode === "big" && isBalanceByPeriod)) {
            return <BalanceRow onRowClick={onRowClick} category={category}>
                {balancesValues.map(amount => {
                    return <span style={{
                        flexBasis: "33%",
                        display: "flex",
                        color: (amount && !isBalanceByPeriod) ? rootStore.getColor(amount, perDay) : undefined,
                        marginRight: 10,
                        fontStyle: isBalanceByPeriod ? 'italic': undefined
                    }}>{fmtBalance(amount)}</span>
                })}
            </BalanceRow>;
        } else if(mode === "hidden") {
            return <div style={{margin: 5, display: "flex", flexDirection: "column", alignItems: "center"}}
                        onClick={onRowClick}
            >
                <div>
                    <img src={imgSrc(category!.img)} height={30}
                         style={{backgroundColor: category!.color, borderRadius: "50%", padding: 4, boxSizing: "border-box"}}
                    />
                </div>
                {!isBalanceByPeriod && <div style={{
                    borderRadius: "50%",
                    backgroundColor: rootStore.getColor(firstValuable, perDay),
                    height: 10, width: 10
                }}/>}
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
                                            style={{
                                                textAlign: 'center',
                                                textDecoration: rootStore.transactionsStore.isCurrDateMoreThanLastFinal(date) ? undefined : "underline"
                                        }}>{rootStore.dateDiffHuman(date)}</div>
                                        <div style={{
                                            color: balance ? rootStore.getColor(balance, perDay) : undefined,
                                            textAlign: 'center',
                                            paddingTop: 20,
                                            fontSize: 27
                                        }}>{fmtBalance(balance)}
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

const func = ({a}) => {
    return a
}

type BalanceRowProps = {
    onRowClick: React.MouseEventHandler<HTMLDivElement>,
    category?: ICategory,
    children: React.ReactNode
}

const BalanceRow = (
    p: BalanceRowProps
) => {
    return <CardGrid onClick={p.onRowClick}>
        <Card size="l" style={{padding: "8px 10px", boxSizing: "border-box"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                    <span style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 17
                    }}>
                        {p.category
                            ? <img src={imgSrc(p.category.img)} height={20} width={20}
                                   style={{
                                       borderRadius: '50%',
                                       marginRight: 10,
                                       backgroundColor: p.category.color,
                                       padding: 4
                                   }}/>
                            : <div style={{height: 20, width: 30}}/>
                        }
                    </span>
                <div style={{display: "flex", flexGrow: "1", marginLeft: 20, fontSize: 20}}>
                    <div style={{display: "flex", flexGrow: 1, justifyContent: "right"}}>
                        {p.children}
                    </div>
                </div>
            </div>
        </Card>
    </CardGrid>
}

export default Balance;