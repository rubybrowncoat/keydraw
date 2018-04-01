import { takeRight as _takeRight, orderBy as _orderBy } from 'lodash-es'

import { startIndeterminate, stopIndeterminate } from '../system/progress'

const boardLink = type => board => {
  return [
    `${board.updated_at} &mdash;`,
    [board.url, { route: `${type}/${board.url}` }],
  ]
}

export default (parsed) => new Promise(async (resolve, reject) => {
  startIndeterminate(['/', '-', '|', '-', '\\', '-'], 'Loading boards...', 100)

  const sharedBoards = _orderBy(_takeRight(
    await $nuxt.$axios.$get(`shared_boards`),
    10
  ), ['id'], ['desc'])

  const savedBoards = _orderBy(_takeRight(
    await $nuxt.$axios.$get(`saved_boards`),
    10
  ), ['id'], ['desc'])

  stopIndeterminate()

  const lsLines = [
    '',
    ['COMMUNES', { styles: ['magenta', 'bold'] }],
    ...sharedBoards.map(boardLink('commune')),
    '',
    ['ARTEFACTS', { styles: ['magenta', 'bold'] }],
    ...savedBoards.map(boardLink('artefact')),
  ]

  resolve(lsLines)
})
