import Vue from 'vue'
import { findIndex as _findIndex, map as _map, reduce as _reduce } from 'lodash'

import keyboard from '../data/keyboard'
import colors from '../data/colors'

export const state = () => ({
  size: [4, 7],

  keyboardWidth: 7,

  actives: {},
})

export const actions = {
  incrementWidth({ commit }) {
    commit('incrementWidth')
  },
  decrementWidth({ commit, state }) {
    if (state.size[0] > 1) {
      commit('decrementWidth')
    }
  },

  incrementHeight({ commit }) {
    commit('incrementHeight')
  },
  decrementHeight({ commit, state }) {
    if (state.size[1] > 1) {
      commit('decrementHeight')
    }
  },

  toggleActive({ state, commit }, payload) {
    const { position, color } = payload
    const currentPosition = state.actives[position]

    if (!currentPosition) {
      commit('addActive', payload)
    } else if (currentPosition.status !== color) {
      commit('replaceActive', payload)
    } else {
      commit('removeActive', position)
    }
  },
  clearActives({ commit }) {
    commit('clearActives')
  },

  setSize({ commit }, payload) {
    const newSize = _map(payload.split('x'), size => parseInt(size))

    commit('setSize', newSize)
  },
  setActives({ commit }, payload) {
    const newActives = _reduce(
      payload.split('/'),
      (result, compressedActive) => {
        const [position, colorIndex] = compressedActive.split('-')
        const [left, top] = position.split('x')

        const color = colors[colorIndex]

        if (color) {
          const colorName = colors[colorIndex].name

          result[position] = {
            top,
            left,
            status: colorName,
          }
        }

        return result
      },
      {}
    )

    commit('setActives', newActives)
  },
}

export const getters = {
  keyboardWidth(state) {
    return state.keyboardWidth
  },
  keyboardHeight(state) {
    return ~~( keyboard.length / state.keyboardWidth )
  },

  gridWidth(state) {
    return state.keyboardWidth * state.size[0]
  },
  gridHeight(state, getters) {
    return getters.keyboardHeight * state.size[1]
  },

  actives(state) {
    return state.actives
  },

  exportSize(state) {
    return `s#${state.size.join('x')}`
  },
  exportActives(state) {
    return `a#${_map(state.actives, (active, key) => {
      const colorIndex = _findIndex(colors, ['hex', active.status])

      return `${key}-${colorIndex}`
    }).join('/')}`
  },
}

export const mutations = {
  incrementWidth(state) {
    Vue.set(state.size, 0, state.size[0] + 1)
  },
  decrementWidth(state) {
    Vue.set(state.size, 0, state.size[0] - 1)
  },

  incrementHeight(state) {
    Vue.set(state.size, 1, state.size[1] + 1)
  },
  decrementHeight(state) {
    Vue.set(state.size, 1, state.size[1] - 1)
  },

  addActive(state, { position, color }) {
    const [left, top] = position.split('x')

    Vue.set(state.actives, position, {
      top,
      left,
      status: color,
    })
  },
  replaceActive(state, { position, color }) {
    const [left, top] = position.split('x')
    const newActives = {
      ...state.actives,
    }

    newActives[position] = {
      top,
      left,
      status: color,
    }

    state.actives = newActives
  },
  removeActive(state, position) {
    Vue.delete(state.actives, position)
  },

  setSize(state, newSize) {
    state.size = newSize
  },
  setActives(state, newActives) {
    state.actives = newActives
  },
  clearActives(state) {
    state.actives = {}
  },
}
