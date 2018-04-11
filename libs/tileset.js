import Decimal from 'decimal.js'

import { findIndex as _findIndex, map as _map, reduce as _reduce, size as _size } from 'lodash-es'

const Tilesettolo = (function () {
  const maker = function(ftiles, fordered) {
    const tileSet = new Object()

    tileSet.tiles = ftiles
    tileSet.ordered = fordered

    tileSet.size = _size(tileSet.tiles)

    tileSet.length = tileSet.size === tileSet.ordered.length ? tileSet.size : 0

    tileSet.getTotalProbability = function() {
      return _reduce(this.tiles, (sum, tile) => sum.plus(Decimal.exp(tile.likelyhood)), new Decimal(0))
    }

    tileSet.getOrderedProbabilities = function() {
      return _map(this.ordered, tileUid => {
        const tile = this.tiles[tileUid]

        return tile.likelyhood
      })
    }

    tileSet.getTotalNormalizedProbability = function() {
      const totalProbability = this.getTotalProbability()

      return _map(this.ordered, tileUid => {
        const tile = this.tiles[tileUid]

        return tile.likelyhood.minus(Decimal.ln(totalProbability))
      })
    }

    tileSet.makeDistribution = function(ordered) {
      return ordered.reduce((distribution, uid) => {
        const tile = this.tiles[uid]
        const previousAggregate = distribution[distribution.length - 1] || new Decimal(0)

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
        const randomPick = Decimal.random().times(distribution[distribution.length - 1])

        const foundIndex = _findIndex(distribution, (aggregate, index, collection) => {
          return randomPick.lte(aggregate) && randomPick.gt(collection[index - 1] || 0)
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