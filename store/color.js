import { findIndex as _findIndex, head as _head, nth as _nth } from 'lodash'

import colors from '../data/colors'

export const state = () => ({
  currentColor: { ..._head(colors) },
})

export const actions = {
  nextColor({ state, commit }) {
    const currentIndex = _findIndex(colors, color => color.name === state.currentColor.name)
    const nextIndex = currentIndex + 1
    const nextColor = { ..._nth(colors, nextIndex % colors.length) }

    commit('setCurrentColor', nextColor)
  },
}

export const getters = {
  currentName(state) {
    return state.currentColor.name
  },
  currentHex(state) {
    return state.currentColor.hex
  },
}

export const mutations = {
  setCurrentColor(state, color) {
    state.currentColor = color
  },
}
