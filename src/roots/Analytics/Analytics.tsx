import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
    Header,
    Root,
    View,
    Cell,
    PullToRefresh, Separator
} from "@vkontakte/vkui/dist";
import PanelHeader from "../../PanelHeader";

import {inject, observer} from "mobx-react/dist";
import RootStore from "../../stores/RootStore";
import './Analytics.scss'
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {IAnalyticsResponse} from "../../global";
import {Period} from "../../stores/models/Period";
import {fmt} from "../../utils/functions";

@inject("RootStore")
@observer
class Analytics extends React.Component<{ RootStore?: RootStore, key: any, id: any }, {}> {
    render() {
        const RootStore = this.props.RootStore!;
        const {appData} = RootStore;
        const analytics: IAnalyticsResponse = appData!.analytics;
        const currPeriod: Period|null = RootStore.periodStore.currPeriod;
        const initStored: number = currPeriod ? currPeriod.initStore : 0;

        const storeValue = analytics.stored - analytics.invested;
        return (
            <Root activeView='1'><View id='1' activePanel={'1'} header={false}><Panel id='1'>
                <PanelHeader title='Аналитика'/>
                <PullToRefresh onRefresh={RootStore.uiStore.refreshPage} isFetching={RootStore.isFetching}>
                    <Group header={<Header mode="secondary">Аналитика</Header>}>
                        <Cell indicator={fmt(analytics.init_sum)}>Начальная сумма: </Cell>
                        <Cell indicator={fmt(analytics.value_real_left)}>Остаток: </Cell>
                        <Cell indicator={fmt(analytics.value_sum)}>Остаток без учета доходов: </Cell>
                        <Cell indicator={fmt(analytics.value_sum - ((storeValue > 0) ? storeValue : 0))}>
                            Остаток без доходов и накоплений: </Cell>
                        <Separator/>
                        {(analytics.stored)
                            ? <Cell indicator={fmt((analytics.stored - initStored))}>
                                Накоплено:
                        </Cell> : null}
                        {initStored
                            ? <Cell indicator={fmt(initStored)}>
                                Нач. накопления:
                            </Cell> : null}
                        {(analytics.invested)
                            ? <Cell indicator={fmt(analytics.invested)}>
                                Вложено:
                        </Cell> : null}
                        <Cell
                            indicator={(<span style={{color: "green"}}>{fmt(storeValue+initStored)}</span>)}>
                            Разница:
                        </Cell>
                    </Group>
                    <Group header={<Header mode={"secondary"}>За этот месяц</Header>}>
                        {analytics.month_analytics.outcomes_by_category?.map(outByCat =>
                            <Cell indicator={fmt(outByCat.sum)} key={outByCat.title}>
                                <div className='outcome_by_category'>
                                    <div className="img" style={{backgroundColor: outByCat.color}}>
                                        {outByCat.img && <img src={outByCat.img} alt='cat_img'/>}
                                    </div>
                                    {outByCat.title || 'Без категории'}
                                </div>
                            </Cell>
                        )}
                    </Group>
                </PullToRefresh>
            </Panel></View></Root>
        );
    }
}

export default Analytics
