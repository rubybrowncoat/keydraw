export default {
  currentTheme(state) {
    return state.currentTheme.name
  },

  exportTheme(state) {
    return `t#${state.currentTheme.name}`
  }
}
