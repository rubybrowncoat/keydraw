import { head as _head, find as _find, findIndex as _findIndex, nth as _nth } from 'lodash-es'

import themes from '../data/themes'

export const state = () => ({
  tileSize: 3,
})

export const actions = {
  increaseTileSize({ commit }) {
    commit('increaseTileSize')
  },
  decreaseTileSize({ getters, commit }) {
    if (getters.tileSize > 3) {
      commit('decreaseTileSize')
    }
  },
}

export const getters = {
  tileSize(state) {
    return state.tileSize
  },

  tileOccupancy(state) {
    return state.tileSize + 1
  },

  mapWidth(state, getters, _, rootGetters) {
    const gridWidth = rootGetters['grid/gridWidth']

    return gridWidth - gridWidth % getters.tileOccupancy
  },
  mapHeight(state, getters, _, rootGetters) {
    const gridHeight = rootGetters['grid/gridHeight']

    return gridHeight - gridHeight % getters.tileOccupancy
  }
}

export const mutations = {
  increaseTileSize(state) {
    state.tileSize += 1
  },
  decreaseTileSize(state) {
    state.tileSize -= 1
  },
}
