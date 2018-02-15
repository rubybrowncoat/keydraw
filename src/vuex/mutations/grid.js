import Vue from 'vue'

export default {
  addActive(state, { position, color }) {
    const [ left, top ] = position.split('x')

    Vue.set(state.actives, position, {
      top,
      left,
      status: color,
    })
  },
  replaceActive(state, { position, color }) {
    const [ left, top ] = position.split('x')
    const newActives = {
      ...state.actives,
    }

    newActives[position] = {
      top,
      left,
      status: color
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
  }
}
