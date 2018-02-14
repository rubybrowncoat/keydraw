export default {
  toggleActive({ state, commit }, payload) {
    const { position, color } = payload
    const currentPosition = state.actives[position]

    if (!currentPosition) {
      commit('addActive', payload)
    } else if (currentPosition.status !== color) {
      commit('addActive', payload)
    } else {
      commit('removeActive', position)
    }
  },
  clearActives({ commit }) {
    commit('clearActives')
  }
}
