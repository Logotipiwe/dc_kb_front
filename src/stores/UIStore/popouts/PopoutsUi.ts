import {makeAutoObservable} from "mobx";
import autoBind from "../../../utils/autoBind";
import UIStore from "../../UIStore";
import {ICategory} from "../../../global";
import {Period} from "../../models/Period";

export interface SelectCatData {
    categoriesToShow: ICategory[],
    selectedCategory?: ICategory,
    onSelect: (cat?: ICategory)=>void
    onClose: ()=>void
}

export default class PopoutsUi {
    constructor(UIStore: UIStore) {
        makeAutoObservable(this)
        autoBind(this)
        this.uiStore = UIStore;
    }

    uiStore: UIStore;

    selectCategoryPopoutData?: SelectCatData;
    deletingPeriod?: Period;

    isShowing(): boolean{
        return !!this.selectCategoryPopoutData
            || !!this.deletingPeriod
    }

    openSelectCategoryPopup(categoriesToShow: ICategory[],
                            selectedCategory: ICategory|undefined,
                            onSelect: (cat?: ICategory)=>void
    ){
        this.selectCategoryPopoutData = {
            categoriesToShow, selectedCategory, onSelect,
            onClose: this.closeSelectCategoryPopup
        };
    }

    closeSelectCategoryPopup(){
        this.selectCategoryPopoutData = undefined;
    }

    setDeletingPeriod(period?: Period){
        this.deletingPeriod = period;
    }
}