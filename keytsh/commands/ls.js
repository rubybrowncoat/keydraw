import { takeRight as _takeRight, orderBy as _orderBy } from 'lodash'

import paint from '../system/paint'

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
    ...sharedBoards.map(board => {
      const link = paint(board.url, { link: `/commune/${board.url}` })

      return paint(`${board.updated_at} &mdash; ${link}`)
    }),
    '',
    '',
    paint('ARTEFACTS', { styles: ['magenta', 'bold'] }),
    '',
    ...savedBoards.map(board => {
      const link = paint(board.url, { link: `/artefact/${board.url}`})

      return paint(`${board.updated_at} &mdash; ${link}`)
    })
  ]

  resolve(lsLines)
})
