import { head as _head } from 'lodash'

import themes from '../../data/themes'

export default {
  currentTheme: { ..._head(themes) },
}
