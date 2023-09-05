import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import RootStore from './stores/RootStore'
import {Provider} from "mobx-react/dist";

const store = new RootStore();

const Root = <Provider RootStore={store}>
  <App/>
</Provider>;

ReactDOM.render(Root, document.getElementById("root"));
