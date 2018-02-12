import { head as _head } from 'lodash'

import colors from '../../data/colors'

export default {
  currentColor: { ..._head(colors) },
}
