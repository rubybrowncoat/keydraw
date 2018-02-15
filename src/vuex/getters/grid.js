import { map as _map, findIndex as _findIndex } from 'lodash'

import colors from '../../data/colors'

export default {
  actives(state) {
    return state.actives
  },

  exportActives(state) {
    return `a#${_map(state.actives, (active, key) => {
      const colorIndex = _findIndex(colors, ['hex', active.status])

      return `${key}-${colorIndex}`
    }).join('/')}`
  }
}
