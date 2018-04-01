import Vue from 'vue'
import {
  findIndex as _findIndex,
  map as _map,
  memoize as _memoize,
  reduce as _reduce
} from 'lodash-es'

import keyboard from '~/data/keyboard'
import colors from '~/data/colors'

const exportDictionary = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
]

const setCharAt = (string, index, character) => string.substr(0, index) + character + string.substr(index + 1)

export const state = () => ({
  size: [4, 7],
  maxSize: [16, 28],

  keyboardWidth: 7,

  actives: {},
})

export const actions = {
  incrementWidth({ commit, state }) {
    if (state.size[0] < state.maxSize[0]) {
    commit('incrementWidth')
   }
  },
  decrementWidth({ commit, state }) {
    if (state.size[0] > 1) {
      commit('decrementWidth')
    }
  },

  incrementHeight({ commit, state }) {
    if (state.size[1] < state.maxSize[1]) {
    commit('incrementHeight')
    }
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
    const newSize = _map(payload.split('-'), size => parseInt(size))

    commit('setSize', newSize)
  },
  setActives({ commit, getters }, payload) {
    const newActives = _reduce(
      payload.replace(
        /\:(.)(\d+)\:/g,
        (match, character, quantity) => character.repeat(quantity)
      ),
      (result, active, index) => {
        if (active != '*') {
          const colorIndex = exportDictionary.indexOf(active)
          const color = colors[colorIndex]

          if (color) {
            const left = index % getters.gridWidth
            const top = Math.floor(index / getters.gridWidth)
            const position = `${left}x${top}`

            const colorName = color.name

            result[position] = {
              top,
              left,
              status: colorName,
            }
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
    return `s#${state.size.join('-')}`
  },
  exportActives(state, getters) {
    const findColor = _memoize(color => _findIndex(colors, ['name', color]))
    const colorCharacter = color => exportDictionary[findColor(color)]

    const emptyString = '*'.repeat(getters.gridWidth * getters.gridHeight)
    const activesString =
      _reduce(state.actives, (aggregator, active, key) => {
        const stringIndex = (
          parseInt(active.top) * parseInt(getters.gridWidth)
        ) + parseInt(active.left)
        const stringCharacter = colorCharacter(active.status)

        return setCharAt(aggregator, stringIndex, stringCharacter)
      }, emptyString)
      .replace(/(.)\1*/g, (match, character) => match.length <= 4 ? match : `:${character}${match.length}:`)

    return 'a#' + activesString
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
