import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Routes from "./routes";
import SuiVue from "semantic-ui-vue";
import TreeView from "vue-json-tree-view";
import VueResizeText from "vue-resize-text";
import jQuery from "jquery";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { ClientTable, Event } from "vue-tables-2";
import { store } from "./store/store";
import VueProgressBar from "vue-progressbar";
import Slider from "vue-range-component";
import PropertyTable from "./components/app-config/PropertyTable";
import Multiselect from "vue-multiselect";
import AsyncComputed from "vue-async-computed";
import VueExcelXlsx from "vue-excel-xlsx";
import VueNavigationBar from "vue-navigation-bar";
import PrettyCheckbox from "pretty-checkbox-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-range-component/dist/vue-range-slider.css";

export const bus = new Vue();

Vue.use(VueRouter);
Vue.use(Slider);
Vue.use(SuiVue);
Vue.use(TreeView);
Vue.use(VueExcelXlsx);
Vue.use(AsyncComputed);
Vue.use(IconsPlugin);
Vue.use(PrettyCheckbox);
Vue.use(BootstrapVue);
Vue.use(VueResizeText);
Vue.use(ClientTable, {}, false, "bootstrap3", {});
Vue.use(VueProgressBar, {
   color: "green",
   failedColor: "red",
   height: "2px",
});

// My components
Vue.component("property-table", PropertyTable);
Vue.component("nav-bar", VueNavigationBar);
Vue.component("multiselect", Multiselect);

//jQuery
window.$ = jQuery;

//Vue tables events
window.vtEvent = Event;

const router = new VueRouter({
   routes: Routes,
   mode: "history",
});

new Vue({
   store: store,
   router: router,
   render: (h) => h(App),
}).$mount("#app");
