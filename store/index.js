import VuexPersistence from 'vuex-persist'

const vuexSorage = new VuexPersistence({
  storage: window.localStorage,

  reducer: state => ({
    color: state.color,
    theme: state.theme,
    grid: state.grid,
  }),
})

export const plugins = [vuexSorage.plugin]

export const strict = false
