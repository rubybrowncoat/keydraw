import {
  findIndex as _findIndex,
  isFunction as _isFunction,
  remove as _remove,
} from 'lodash-es'

import Distribuzia from './distribution'

const stop = require('lodash-es').after(20, () => {
  throw Error('stop')
})

class Mapperotta {
  constructor(fwidth, fheight, ftileSet) {
    this.columns = fwidth
    this.rows = fheight

    this.tileSet = ftileSet

    this.buffer = new Array(this.columns * this.rows)
    this.orderedCreation = []

    this.initialNormalizedDistribution = false
    this.tileSetDistributions = false

    this.sequentialBuffer = this.sequentialBufferLocations()
  }

  sequentialBufferLocations() {
    const sequential = []

    for (let iterator = 0; iterator < this.buffer.length; iterator += 1) {
      sequential.push(this.indexToLocation(iterator))
    }

    return sequential
  }

  distributeSet() {
    if (!this.initialNormalizedDistribution || !this.tileSetDistributions) {
      const tileSetProbabilities = this.tileSet.ordered.map(tileUid => {
        const tile = this.tileSet.get(tileUid)

        return Math.max(1, tile.likelyhood) / 255
      })

      this.initialNormalizedDistribution = new Distribuzia(tileSetProbabilities, tileSetProbabilities.length, true)

      this.tileSetDistributions = new Mapperotta(this.columns, this.rows, this.tileSet)
      this.tileSetDistributions.fill(() => this.initialNormalizedDistribution.clone())
    }
  }

  lowestEntropy() {
    const mapLocations = this.sequentialBuffer

    let lowest = 10113034
    let bestLocation = false

    mapLocations.forEach(location => {
      const locationEntropy = this.tileSetDistributions.get(location).entropy()

      if (locationEntropy < lowest && !this.get(location)) {
        lowest = locationEntropy
        bestLocation = location
      }
    })

    return bestLocation
  }

  indexToLocation(bufferIndex) {
    return [bufferIndex % this.columns, (bufferIndex / this.columns) >> 0]
  }

  get([x, y]) {
    if (x < 0 || x >= this.columns) {
      return false
    }

    if (y < 0 || y >= this.rows) {
      return false
    }

    return this.buffer[y * this.columns + x]
  }

  set([x, y], value) {
    if (x < 0 || x >= this.columns) {
      return false
    }

    if (y < 0 || y >= this.rows) {
      return false
    }

    this.buffer[y * this.columns + x] = value

    return value
  }

  fill(filler) {
    for (let iterator = 0; iterator < this.buffer.length; iterator += 1) {
      const content = _isFunction(filler) ? filler(this.buffer[iterator]) : filler

      this.buffer[iterator] = content
    }
  }

  rectifyDistributions(location, selectionIndex, spheres) {
    const sphere = spheres[selectionIndex]
    const tile = this.tileSet.get(selectionIndex)

    const [locationX, locationY] = location

    const halfWidth = (sphere.columns / 2) >> 0
    const halfHeight = (sphere.rows / 2) >> 0

    const startX = Math.max(locationX - halfWidth, 0)
    const endX = Math.min(locationX + halfWidth, this.columns)

    const startY = Math.max(locationY - halfHeight, 0)
    const endY = Math.min(locationY + halfHeight, this.rows)

    for (let iteratorY = startY; iteratorY <= endY; iteratorY += 1) {
      for (let iteratorX = startX; iteratorX <= endX; iteratorX += 1) {
        const sphereX = iteratorX - locationX + halfWidth
        const sphereY = iteratorY - locationY + halfHeight

        const locationDistribution = this.tileSetDistributions.get([iteratorX, iteratorY])
        const sphereLocationDistribution = sphere.get([sphereX, sphereY])

        if (locationDistribution && sphereLocationDistribution) {
          locationDistribution.multiply(sphereLocationDistribution).normalize()
        }
      }
    }

    this.set(location, tile)
    this.orderedCreation.push(location)
  }

  placeTile(location, spheres) {
    if (!this.get(location)) {
      const locationDistribution = this.tileSetDistributions.get(location)
      const weightedSelectionIndex = locationDistribution.weightedSelection()

      this.rectifyDistributions(location, weightedSelectionIndex, spheres)

      return weightedSelectionIndex
    }
  }

  getNeighbors([x, y]) {
    return [
      y >= 1 ? this.get([x, y - 1]) : false,
      x < this.columns - 1 ? this.get([x + 1, y]) : false,
      y < this.rows - 1 ? this.get([x, y + 1]) : false,
      x >= 1 ? this.get([x - 1, y]) : false,
    ]
  }

  getNeighborLocations([x, y]) {
    return [
      y >= 1 ? [x, y - 1] : false,
      x < this.columns - 1 ? [x + 1, y] : false,
      y < this.rows - 1 ? [x, y + 1] : false,
      x >= 1 ? [x - 1, y] : false,
    ]
  }

  isValidNeighbor(sourceTile, sourceLocation, neighborTile, neighborLocation) {
    const [sourceX, sourceY] = sourceLocation
    const [neighborX, neighborY] = neighborLocation

    if (
      neighborX >= this.columns ||
      neighborY >= this.rows ||
      neighborX < 0 ||
      neighborY < 0
    ) {
      return true
    } else {
      return sourceTile.matrix.isValidNeighbor(neighborTile.matrix, [
        neighborX - sourceX,
        neighborY - sourceY,
      ])
    }
  }

  isSameLocation(firstLocation, secondLocation) {
    const compareLocations = otherLocation => {
      return firstLocation[0] === otherLocation[0] && firstLocation[1] === otherLocation[1]
    }

    if (secondLocation) {
      return compareLocations(secondLocation)
    }

    return compareLocations
  }

  walkedBufferLocations(startLocation = [0, 0]) {
    const queue = []
    const walked = []

    queue.push(startLocation)

    while (queue.length > 0) {
      const current = queue.shift()

      walked.push(current)
      _remove(queue, this.isSameLocation(current))

      this.getNeighborLocations(current).forEach(neighborLocation => {
        const isNeighborLocation = this.isSameLocation(neighborLocation)

        if (
          neighborLocation &&
          _findIndex(walked, isNeighborLocation) === -1 &&
          _findIndex(queue, isNeighborLocation) === -1
        ) {
          queue.push(neighborLocation)
        }
      })
    }

    return walked
  }
}

export default Mapperotta
