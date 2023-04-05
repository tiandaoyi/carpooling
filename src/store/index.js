// store 文件下的index.js
import todo from "./module/todo";
import baseInfo from "./module/baseInfo";
import createPersistedState from "vuex-persistedstate";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    todo,
    baseInfo
  },
  plugins: [createPersistedState()],
});
