import '@/utils/env';
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "amfe-flexible";
import "vant/lib/index.css";

import {
  Calendar,
  Button,
  Popup,
  Checkbox,
  CheckboxGroup,
  DatetimePicker,
  Field,
  ActionSheet,
  Picker,
  RadioGroup,
  Radio,
  Search,
  Overlay,
  Loading,
  Icon,
  Form,
  Cell,
  CellGroup,
  Tab,
  Tabs,
  Dialog,
  Stepper,
  NavBar,
  PullRefresh,
  List,
  Toast,
  Image,
  Empty,
  AddressEdit,
} from "vant";

import moment from "moment"; // 赋值使用

import _ from "lodash";
// 加入sentry报错日志
import "./sentry.js";

/** 对导入的组件进行全局组件注册 */
import components from "./components/index.js";

// 注册全局指令
import directives from "@/utils/directives.js";
Vue.use(Calendar)
  .use(Button)
  .use(Popup)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(ActionSheet)
  .use(DatetimePicker)
  .use(Field)
  .use(Picker)
  .use(Radio)
  .use(RadioGroup)
  .use(Dialog)
  .use(Search)
  .use(Overlay)
  .use(Loading)
  .use(Icon)
  .use(Form)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(NavBar)
  .use(Stepper)
  .use(Toast)
  .use(PullRefresh)
  .use(List)
  .use(Empty)
  .use(Image)
  .use(AddressEdit);
Vue.prototype.$moment = moment;
Vue.prototype.$Toast = Toast;
Vue.prototype._ = _;
Object.keys(components).forEach((key) => {
  Vue.component(key, components[key]);
});
Vue.use(directives);

// 控制台按钮
// if (process.env.NODE_ENV === 'development') {
  const Vconsole = require("vconsole");
  // eslint-disable-next-line no-new
  new Vconsole();
// }

const homeScrollTop = 0;
Vue.prototype.$homeScroll = homeScrollTop; // 全局滚动位置

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
