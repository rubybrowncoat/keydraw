import { takeRight as _takeRight, orderBy as _orderBy } from 'lodash'

import paint from '../system/paint'

const boardLink = type => board => {
  const link = paint(board.url, {
    link: `${process.env.DEPLOY_DIRECTORY}#/${type}/${board.url}`
  })

  return paint(`${board.updated_at} &mdash; ${link}`)
}

export default (parsed) => new Promise(async (resolve, reject) => {
  const sharedBoards = _orderBy(_takeRight(
    await $nuxt.$axios.$get(`shared_boards`),
    10
  ), ['id'], ['desc'])

  const savedBoards = _orderBy(_takeRight(
    await $nuxt.$axios.$get(`saved_boards`),
    10
  ), ['id'], ['desc'])

  const lsLines = [
    '',
    paint('COMMUNES', { styles: ['magenta', 'bold'] }),
    '',
    ...sharedBoards.map(boardLink('commune')),
    '',
    '',
    paint('ARTEFACTS', { styles: ['magenta', 'bold'] }),
    '',
    ...savedBoards.map(boardLink('artefact'))
  ]

  resolve(lsLines)
})
