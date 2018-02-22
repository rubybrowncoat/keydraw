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
    const { position, name } = payload
    const currentPosition = state.actives[position]

    if (!currentPosition) {
      commit('addActive', payload)
    } else if (currentPosition.status !== name) {
      commit('replaceActive', payload)
    } else {
      commit('removeActive', position)
    }
  },
  setShared({ state, commit }, payload) {
    const { position, status } = payload
    const currentPosition = state.actives[position]

    const color = colors[status]

    if (color) {
      const mutationPayload = {
        position,
        name: color.name,
      }

      commit('replaceActive', mutationPayload)
    } else {
      commit('removeActive', position)
    }
  },
  toggleShared({ state, commit}, payload) {
    const { left, top, url, name } = payload

    const position = `${left}x${top}`
    const mutationPayload = {
      position,
      name,
    }

    const currentPosition = state.actives[position]
    let colorIndex = _findIndex(colors, ['name', name])

    if (!currentPosition) {
      commit('addActive', mutationPayload)
    } else if (currentPosition.status !== name) {
      commit('replaceActive', mutationPayload)
    } else {
      colorIndex = -1
      commit('removeActive', position)
    }

    this.$axios.$post('shared_actives', {
      status: colorIndex,

      left,
      top,

      url,
    })
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
          const colorName = color.name

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
  setCommuneActives({ commit }, payload) {
    const newActives = _reduce(
      payload,
      (result, active) => {
        const position = `${active.left}x${active.top}`

        const color = colors[active.status]

        if (color) {
          const colorName = color.name

          result[position] = {
            top: active.top,
            left: active.left,
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
      const colorIndex = _findIndex(colors, ['name', active.status])

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

  addActive(state, { position, name }) {
    const [left, top] = position.split('x')

    Vue.set(state.actives, position, {
      top,
      left,
      status: name,
    })
  },
  replaceActive(state, { position, name }) {
    const [left, top] = position.split('x')
    const newActives = {
      ...state.actives,
    }

    newActives[position] = {
      top,
      left,
      status: name,
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
