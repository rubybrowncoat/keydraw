import { findIndex as _findIndex, remove as _remove } from 'lodash-es'

class Mapperotta {
  constructor(fwidth, fheight) {
    this.columns = fwidth
    this.rows = fheight

    this.buffer = new Array(this.columns * this.rows)
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

    if (neighborX >= this.columns || neighborY >= this.rows || neighborX < 0 || neighborY < 0) {
      return true
    } else {
      return sourceTile
    }
  }
  // boolean isValidNeighbor(Tile tile, int tileX, int tileY, Tile neighbor, int neighborX, int neighborY) {
  //   if (neighborX>=mapWidth || neighborY>=mapWidth || neighborX<0 || neighborY<0) {
  //     return true;
  //   } else {
  //     Directions direction = getDirectionFromDelta(neighborX-tileX, neighborY-tileY);
  //     return tile.isValidNeighbor(neighbor, direction);
  //   }
  // }

  isSameLocation(firstLocation, secondLocation) {
    const compareLocations = (otherLocation) => {
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
