import BigNumber from 'bignumber.js'

import { findIndex as _findIndex } from 'lodash-es'

const Tilesettolo = (function () {
  const maker = function(ftiles, fordered) {
    const tileSet = new Object()

    tileSet.tiles = ftiles
    tileSet.ordered = fordered

    tileSet.makeDistribution = function(ordered) {
      return ordered.reduce((distribution, uid) => {
        const tile = this.tiles[uid]
        const previousAggregate = distribution[distribution.length - 1] || new BigNumber(0)

        distribution.push(previousAggregate.plus(tile.likelyhood))

        return distribution
      }, [])
    }

    tileSet.pick = function(overrideOrdered) {
      let ordered = this.ordered
      let distribution = this.distribution

      if (overrideOrdered) {
        ordered = overrideOrdered
        distribution = this.makeDistribution(ordered)
      }

      if (distribution.length) {
        const randomPick = BigNumber.random().multipliedBy(distribution[distribution.length - 1])

        const foundIndex = _findIndex(distribution, (aggregate, index, collection) => {
          return randomPick.isLessThanOrEqualTo(aggregate) && randomPick.isGreaterThan(collection[index - 1] || 0)
        })

        if (foundIndex > -1) {
          return this.tiles[ordered[foundIndex]]
        }
      } else {
        return this.pick()
      }
    }

    tileSet.distribution = tileSet.makeDistribution(tileSet.ordered)

    return tileSet
  }

  return maker
}())

export default Tilesettolo
