import Vue from 'vue'
import Vuex from 'vuex'
import * as todo from './todo'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    counter: 0
  },
  modules:{
    todo
  },
  actions:{
    nuxtServerInit({commit}, {req}){
      console.log("nuxtServerInit");
    }
  },
  mutations: {
    increment (state) {
      state.counter++
    }
  }
})

export default store