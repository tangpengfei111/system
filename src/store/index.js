import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: [
      {
        name: 'admin1',
        password: '123456',
        role: 'superAdmin'
      },
      {
        name: 'admin2',
        password: '123456',
        role: 'generalAdmin'
      },
      {
        name: 'admin3',
        password: '123456',
        role: 'prodUser'
      },
      {
        name: 'admin4',
        password: '123456',
        role: 'stockUser'
      },
    ]
  },
  mutations: {
    createUser(state,option) {
      state.userInfo.push(option);
      console.log(state.userInfo);
    }
  },
  actions: {
  },
  modules: {
  }
})
