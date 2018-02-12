import { findIndex as _findIndex, nth as _nth } from 'lodash'

import colors from '../../data/colors'

export default {
  nextColor({ state, commit }) {
    console.log(...colors)
    const currentIndex = _findIndex(colors, (color) => color.name === state.currentColor.name)
    const nextIndex = currentIndex + 1
    const nextColor = { ..._nth(colors, nextIndex % colors.length) }

    commit('setCurrentColor', nextColor)
  }
}
