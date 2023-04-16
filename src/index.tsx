import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import RootStore from './stores/RootStore'
import {Provider} from "mobx-react/dist";
// import './eruda'

const store = new RootStore();

const Root = <Provider RootStore={store}>
  <App/>
</Provider>;
// Init VK  Mini App

ReactDOM.render(Root, document.getElementById("root"));
// if (process.env.NODE_ENV === "development") {
//   import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
