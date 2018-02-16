import Vue from 'vue'
import { findIndex as _findIndex, map as _map, reduce as _reduce } from 'lodash'

import colors from '../data/colors'

export const state = () => ({
  actives: {},
})

export const actions = {
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

  setActives({ commit }, payload) {
    const newActives = _reduce(
      payload.split('/'),
      (result, compressedActive) => {
        const [position, colorIndex] = compressedActive.split('-')
        const [left, top] = position.split('x')

        const colorHex = colors[colorIndex].hex

        result[position] = {
          top,
          left,
          status: colorHex,
        }

        return result
      },
      {}
    )

    commit('setActives', newActives)
  },
}

export const getters = {
  actives(state) {
    return state.actives
  },

  exportActives(state) {
    return `a#${_map(state.actives, (active, key) => {
      const colorIndex = _findIndex(colors, ['hex', active.status])

      return `${key}-${colorIndex}`
    }).join('/')}`
  },
}

export const mutations = {
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

  setActives(state, newActives) {
    state.actives = newActives
  },
  clearActives(state) {
    state.actives = {}
  },
}
