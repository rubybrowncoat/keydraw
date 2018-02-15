import { reduce as _reduce } from 'lodash'

import colors from '../../data/colors'

export default {
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
    const newActives = _reduce(payload.split('/'), (result, compressedActive) => {
      const [ position, colorIndex ] = compressedActive.split('-')
      const [ left, top ] = position.split('x')

      const colorHex = colors[colorIndex].hex

      console.log({
        position, colorIndex, top, left, colorHex, result,
      })

      result[position] = {
        top,
        left,
        status: colorHex,
      }

      return result
    }, {})

    commit('setActives', newActives)

    console.log(newActives)
  }
}
