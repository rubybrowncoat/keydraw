import Decimal from 'decimal.js'

import { indexOf as _indexOf, isArray as _isArray, reduce as _reduce } from 'lodash-es'

import Mapperotta from './map'
import Distribuzia from './distribution'

class Distribolla extends Mapperotta {
  constructor(fwidth, fheight, ftileSet, fcenterTile = false, skipConstruction = false) {
    super(fwidth, fheight, ftileSet)

    if (skipConstruction) {
      return this
    }

    this.centerTile = fcenterTile || this.tileSet.pick()

    const sphereWalkedBufferLocation = this.walkedBufferLocations([
      Math.round(this.columns / 2),
      Math.round(this.rows / 2),
    ])
    sphereWalkedBufferLocation.forEach((location, index) => {
      const distribution = new Distribuzia(new Decimal('0.00000000000000000001'), this.tileSet.length)

      if (index === 0) {
        const tileOrderedIndex = _indexOf(this.tileSet.ordered, this.centerTile.uid)
        distribution.setProbability(tileOrderedIndex, new Decimal(1))
      } else {
        const neighborLocations = this.getNeighborLocations(location)

        neighborLocations.forEach(neighborLocation => {
          if (neighborLocation && this.get(neighborLocation)) {
            const transitionalDistribution = this.transitionalDistribution(
              neighborLocation,
              location
            )

            distribution.add(transitionalDistribution)
          }
        })
      }

      this.set(location, distribution.normalize())
    })
  }

  transitionalDistribution(fromLocation, toLocation) {
    const probabilities = this.tileSet.ordered.map(toTileUid => {
      const toTile = this.tileSet.get(toTileUid)

      const probability = _reduce(this.tileSet.ordered, (probability, fromTileUid, fromTileIndex) => {
        const fromTile = this.tileSet.get(fromTileUid)

        const validity = toTile.matrix.isValidNeighbor(fromTile, [
          fromLocation[0] - toLocation[0],
          fromLocation[1] - toLocation[1],
        ])
          ? new Decimal(1)
          : new Decimal(0)

        return probability.plus(
          this.get(fromLocation)
            .getProbability(fromTileIndex)
            .times(validity)
        )
      }, new Decimal(0))

      return probability
    })

    return new Distribuzia(probabilities)
  }

  export() {
    const tileIndex = _indexOf(this.tileSet.ordered, this.centerTile.uid)

    return [this.columns, this.rows, tileIndex, this.buffer.map(distribution => {
      return distribution.toStringArray()
    })]
  }

  static import(exportArray, tileSet) {
    const [width, height, tileIndex, distributions] = exportArray

    const importedSphere = new Distribolla(width, height, tileSet, false, true)

    importedSphere.centerTile = tileSet.get(tileIndex)
    importedSphere.buffer = distributions.map(distribution => {
      return new Distribuzia(distribution)
    })

    return importedSphere
  }
}

export default Distribolla
