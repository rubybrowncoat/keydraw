import { findIndex as _findIndex, nth as _nth } from 'lodash'

import themes from '../../data/themes'

export default {
  nextTheme({ state, commit }) {

    const currentIndex = _findIndex(themes, (theme) => theme.name === state.currentTheme.name)
    const nextIndex = currentIndex + 1
    const nextTheme = { ..._nth(themes, nextIndex % themes.length) }

    commit('setCurrentTheme', nextTheme)
  }
}
