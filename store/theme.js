import { head as _head, find as _find, findIndex as _findIndex, nth as _nth } from 'lodash-es'

import themes from '../data/themes'

export const state = () => ({
  currentTheme: { ..._head(themes) },
})

export const actions = {
  nextTheme({ state, commit }) {
    const currentIndex = _findIndex(themes, theme => theme.name === state.currentTheme.name)
    const nextIndex = currentIndex + 1
    const nextTheme = { ..._nth(themes, nextIndex % themes.length) }

    commit('setCurrentTheme', nextTheme)
  },

  previousTheme({ state, commit }) {
    const currentIndex = _findIndex(themes, theme => theme.name === state.currentTheme.name)
    const previousIndex = currentIndex - 1
    const previousTheme = { ..._nth(themes, previousIndex % themes.length) }

    commit('setCurrentTheme', previousTheme)
  },

  setTheme({ state, commit }, themeName) {
    const theme = { ..._find(themes, ['name', themeName]) }

    commit('setCurrentTheme', theme)
  },
}

export const getters = {
  currentTheme(state) {
    return state.currentTheme.name
  },

  exportTheme(state) {
    return `t#${state.currentTheme.name}`
  },
}

export const mutations = {
  setCurrentTheme(state, theme) {
    state.currentTheme = theme
  },
}
