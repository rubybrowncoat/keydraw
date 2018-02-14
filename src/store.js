import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import colorModule from './vuex/modules/color'
import themeModule from './vuex/modules/theme'
import gridModule from './vuex/modules/grid'

Vue.use(Vuex)

const vuexSorage = new VuexPersistence({
  storage: window.localStorage,

  reducer: state => ({
    color: state.color,
    theme: state.theme,
    grid: state.grid,
  }),
})

const store = new Vuex.Store({
  modules: {
    color: colorModule,
    theme: themeModule,
    grid: gridModule,
  },

  plugins: [
    vuexSorage.plugin,
  ],
})

export default store
