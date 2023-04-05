const state = {
  sassBaseData: { 
    aesPhone:'',//加密手机号
    truePhone:'',//解密手机号
    maskPhone:'',//*手机号
    id:'',
    avatar:'',//头像
    fullPathNameList:[],//组织架构
    jobNumber:'',//工作编号
    name:'',//姓名
    position:'',//职位
    username:'',
    email:'',
  },
};

const mutations = {
  mutations_base_data(state, item) {
    console.log(item);
    state.sassBaseData = item;
  },
};
const actions = {
  actions_base_data: (context, item) => {
    context.commit("mutations_base_data", item);
  },
};

const getters = {
  sassBaseData: (state) => state.sassBaseData || {},
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
