import RootStore from "../RootStore";
import {makeAutoObservable} from "mobx";
import UIStore from "../UIStore";
import autoBind from "../../utils/autoBind";

const STORAGE_KEY = "balanceDisplayModes";

export type DisplayMode = "big" | "row" | "hidden";

export default class BalancesUi {
    constructor(uiStore: UIStore) {
        makeAutoObservable(this)
        autoBind(this)
        let str = window.localStorage.getItem(STORAGE_KEY);
        if(!str){
            str = "{}";
            window.localStorage.setItem(STORAGE_KEY, str)
        }
        this.displayModesByCatId = JSON.parse(str);
    }

    allModes: DisplayMode[] = ["big","row","hidden"]
    defaultMode: DisplayMode = "big";
    displayModesByCatId: Record<string, DisplayMode>;

    isBalanceShown(catId?: number){
        const mode = this.getDisplayModeByCatId(catId);
        return mode !== "hidden";
    }

    getDisplayModeByCatId(catId?: number){
        if(!catId) return this.displayModesByCatId["0"]
        return this.displayModesByCatId[catId.toString()] || this.defaultMode;
    }

    shiftDisplayMode(catId?: number, skipBig = true) {
        const mode = this.getDisplayModeByCatId(catId);
        const newModeIndex = this.allModes.indexOf(mode) + 1
        let newMode = newModeIndex < this.allModes.length ? this.allModes[newModeIndex] : this.allModes[0]
        if(newMode === "hidden" && !catId) {
            newMode = this.allModes[0]
        }
        if(skipBig && newMode === 'big') newMode = "row"
        this.setNewDisplayMode(newMode, catId)
    }

    setNewDisplayMode(mode: DisplayMode, catId?: number) {
        this.displayModesByCatId[catId ? catId.toString() : "0"] = mode
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.displayModesByCatId));
    }
}