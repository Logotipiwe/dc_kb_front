import React from "react";
import {inject} from "mobx-react/dist";
import {Card, CardGrid, PanelHeaderSimple} from "@vkontakte/vkui";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
import {Icon24Cancel} from "@vkontakte/icons";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import {ICategory} from "../../../global";
import RootStore from "../../../stores/RootStore";
import autoBind from "../../../utils/autoBind";
import {observer} from "mobx-react";


type props = {
    categories: ICategory[],
    onSelect: (cat?: ICategory)=>void,
    onClose: Function,
    selectedCategory?: ICategory
    RootStore?: RootStore
};

type state = {
    selectedCat?: ICategory,
    categoriesToShow: ICategory[]
    allCategories: ICategory[],
    isShowingRootCats: boolean
}

@inject("RootStore")
@observer
class CategoriesPanel extends React.Component<props, state>{
    constructor(props) {
        super(props);
        autoBind(this)
        this.state = {
            selectedCat: undefined,
            categoriesToShow: props.categories,
            allCategories: Object.values(props.RootStore!.transactionsStore.categories),
            isShowingRootCats: true
        }
    }

    onCatClick(category: ICategory) {
        if(this.props.selectedCategory === category) {
            this.onSelect(undefined);
            return
        }
        const children = this.state.allCategories.filter(c=>c.parent===category.id)
        if(children.length){
            this.setState({
                ...this.state,
                selectedCat: category,
                isShowingRootCats: false,
                categoriesToShow: children
            })
        } else {
            this.onSelect(category)
        }
    }

    onWithoutSubcatClick(){
        if (this.state.selectedCat) {
            this.onSelect(this.state.selectedCat)
        } else {
            this.props.onClose()
        }
    }

    onSelect(cat?: ICategory){
        console.log("selecting cat", cat)
        this.props.onSelect(cat)
        this.props.onClose()
    }

    render() {
        const rootStore = this.props.RootStore!;
        const onClose: Function = this.props.onClose;
        const transactionsUI = rootStore.uiStore.transactionsUI;

        const categoriesToShow = this.state.categoriesToShow;
        const allCategories = this.state.allCategories;

        const chunkSize = 4;
        const categoriesChunked = categoriesToShow.map((x, i) => categoriesToShow
            .slice(i * chunkSize, i * chunkSize + chunkSize))
            .filter(arr => arr.length);

        return <Panel>
            <PanelHeaderSimple>Выбор категории</PanelHeaderSimple>
            <Group>
                <Header
                    onClick={()=>onClose()} aside={<Icon24Cancel/>} style={{margin: '15 0'}}
                >Назад</Header>
                {this.state.isShowingRootCats ? null
                    : <Button size={'l'} style={{width: "calc(100% - 20px)", margin: "10px"}} onClick={this.onWithoutSubcatClick}
                    >Без подкатегории</Button>}

                {categoriesChunked.map((chunk, i) =>
                    <CardGrid key={i}>
                        {chunk.map(category => {
                            return <Card
                                className={"category_card_outer"}
                                key={category.id}
                                size={'s'}
                                style={this.props.selectedCategory?.id === category.id ? {backgroundColor: "var(--tabbar_tablet_active_icon)"} : {}}
                                onClick={this.onCatClick.bind(null, category)}
                            >
                                <div className="category_card">
                                    <div className="img" style={{backgroundColor: category.color}}>
                                        <img src={category.img} alt='.'/>
                                    </div>
                                    {category.title}
                                </div>
                            </Card>

                        })}
                    </CardGrid>
                )}
            </Group>
        </Panel>
    }
}

export default CategoriesPanel;