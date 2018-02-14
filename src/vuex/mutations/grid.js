import Vue from 'vue'

export default {
  addActive(state, { position, color }) {
    const [left, top] = position.split('x')

    Vue.set(state.actives, position, {
      top,
      left,
      status: color,
    })
  },
  removeActive(state, position) {
    Vue.delete(state.actives, position)
  },
  clearActives(state) {
    state.actives = {}
  }
}
