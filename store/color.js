import { findIndex as _findIndex, head as _head, nth as _nth } from 'lodash-es'

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

  previousColor({ state, commit }) {
    const currentIndex = _findIndex(colors, color => color.name === state.currentColor.name)
    const previousIndex = currentIndex - 1
    const previousColor = { ..._nth(colors, previousIndex % colors.length) }

    commit('setCurrentColor', previousColor)
  },
}

export const getters = {
  currentName(state) {
    return state.currentColor.name
  },
}

export const mutations = {
  setCurrentColor(state, color) {
    state.currentColor = color
  },
}
