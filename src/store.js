import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import colorModule from './vuex/modules/color'

Vue.use(Vuex)

const vuexSorage = new VuexPersistence({
  storage: window.localStorage,

  reducer: state => ({
    color: state.color,
  }),
})

const store = new Vuex.Store({
  modules: {
    color: colorModule,
  },

  plugins: [
    vuexSorage.plugin,
  ],
})

export default store
