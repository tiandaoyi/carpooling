const state = {
  todoData: {},
};

const mutations = {
  mutations_todo_data(state, item) {
    state.todoData = item;
  },
};
const actions = {
  actions_to_data: (context, item) => {
    context.commit("mutations_todo_data", item);
  },
};

const getters = {
  todoData: (state) => state.todoData || {},
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
