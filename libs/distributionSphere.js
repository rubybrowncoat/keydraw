import Decimal from 'decimal.js'

import { indexOf as _indexOf, isArray as _isArray } from 'lodash-es'

import Mapperotta from './map'
import Distribuzia from './distribution';

class Distribolla extends Mapperotta {
  constructor(fwidth, fheight, ftileSet, fcenterTile = false) {
    super(fwidth, fheight)

    this.tileSet = ftileSet
    this.length = this.tileSet.length

    console.log('tileset', this.tileSet)

    this.centerTile = fcenterTile || this.tileSet.pick()

    const sphereWalkedBufferLocation = this.walkedBufferLocations([
      Math.round(this.columns / 2),
      Math.round(this.rows / 2),
    ])

    sphereWalkedBufferLocation.forEach((location, index) => {
      const distribution = new Distribuzia(new Decimal('0.0000001'), this.length)
      console.log(this.length, distribution)

      if (index) {
        const tileOrderedIndex = _indexOf(this.tileSet.ordered, this.centerTile.uid)
        distribution.setProbability(tileOrderedIndex, new Decimal('1'))
      } else {
        const neighborLocations = this.getNeighborLocations(location)

        neighborLocations.forEach(neighborLocation => {
          if (this.get(neighborLocation)) {
            const transitionalDistribution = this.transitionalDistribution(neighborLocation, location)

            distribution.add(transitionalDistribution)
          }
        })
      }

      this.set(location, distribution.toNormalized())
    })
  }

  transitionalDistribution(fromLocation, toLocation) {
    const probabilities = this.tileSet.ordered.map(tileUid => {
      const toTile = this.tileSet[tileUid]
    })

    // Tile tileFrom;
    // Tile tileTo;
    // double[] probabilities = new double[wangTiles.size()];
    // for (int i = 0; i < wangTiles.size(); i++){
    //   tileTo = wangTiles.get(i);
    //   double p = (double)0;
    //   for (int j = 0; j < wangTiles.size(); j++){
    //     tileFrom = wangTiles.get(j);
    //     double valid = isValidNeighbor(tileTo, to.x, to.y, tileFrom, from.x, from.y) ? (double)1 : (double)0;

    //     p += tileDistributions[from.x][from.y].getProbability(tileFrom) * valid;
    //   }
    //   probabilities[i] = (double)Math.log(p);
    // }

    // return new TileProbabilityDistribution(probabilities);
  }
}

export default Distribolla
