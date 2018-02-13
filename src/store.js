import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import colorModule from './vuex/modules/color'
import themeModule from './vuex/modules/theme'

Vue.use(Vuex)

const vuexSorage = new VuexPersistence({
  storage: window.localStorage,

  reducer: state => ({
    color: state.color,
    theme: state.theme,
  }),
})

const store = new Vuex.Store({
  modules: {
    color: colorModule,
    theme: themeModule,
  },

  plugins: [
    vuexSorage.plugin,
  ],
})

export default store
