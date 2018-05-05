import { each as _each, fill as _fill, sum as _sum } from 'lodash-es'

export const randomIndice = (arr, randomNumber) => {
  let sum = _sum(arr)

  let array = arr.map((value, _, group) => (sum ? value / sum : 1 / group.length))

  let iterator = 0
  let comparator = 0
  while (iterator < array.length) {
    comparator += array[iterator]
    if (randomNumber <= comparator) {
      return iterator
    }

    iterator += 1
  }

  return 0
}

export const objectOccurrence = (object, value) => {
  let key = null

  for (const property in object) {
    if (object.hasOwnProperty(property)) {
      if (object[property] <= value) {
        key = property
      }
    }
  }

  return key
}

class Observanto {
  constructor(fwidth, fheight, ftileset) {
    this.initialized = false
    this.complete = false

    this.wave = []
    this.changes = null
    this.stationary = []
    this.propagator = []

    this.width = fwidth
    this.height = fheight

    this.tileset = ftileset
    this.tiles = ftileset.tiles.length
    this.tilesize = ftileset.tileSize

    this.black = false

    this.periodic = false

    this.actuated = 0
    this.actuatedTiles = []

    this.initialize()
  }

  edge([horizontal, vertical], tile) {
    if (horizontal) {
      const horizontalEdge = tile.filter(
        (_, index) => index % this.tilesize == (1 / 2 + horizontal / 2) * (this.tilesize - 1)
      )

      return horizontalEdge
    }

    if (vertical) {
      const verticalEdge = tile.filter(
        (_, index) =>
          index < this.tilesize ** ((vertical + 3) / 2) &&
          index >= 1 / 2 * this.tilesize * (this.tilesize - 1) * (vertical + 1)
      )

      return verticalEdge
    }
  }

  clockwise(buffer, rotationSteps = 1) {
    const steps = rotationSteps % 4
    if (!steps) {
      return buffer
    }

    const length = buffer.length
    const rotatedBuffer = new buffer.constructor(length)

    const width = this.tilesize
    const height = this.tilesize

    for (let iterator = 0; iterator < this.length; iterator += 1) {
      const column = iterator % height
      const row = (iterator - column) / height

      rotatedBuffer[iterator] = this.buffer[
        (height - 1) * width - column * width + row
      ]
    }

    return this.clockwise(rotatedBuffer, steps - 1)
  }

  counterClockwise(buffer, rotationSteps = 1) {
    const steps = rotationSteps % 4
    if (!steps) {
      return buffer
    }

    const length = buffer.length
    const rotatedBuffer = new buffer.constructor(length)

    const width = this.tilesize
    const height = this.tilesize

    for (let iterator = 0; iterator < length; iterator += 1) {
      const column = iterator % height
      const row = (iterator - column) / height

      rotatedBuffer[iterator] = buffer[width - 1 - row + column * height]
    }

    return this.counterClockwise(rotatedBuffer, steps - 1)
  }

  initialize() {
    let funcA
    let cardinality

    let action = []
    let firstOccurrence = {}

    var neighbor, left, right, L, R, D, U

    _each(this.tileset.tiles, tile => {
      switch (tile.symmetry) {
        case 'I':
        case 'S': {
          cardinality = 2
          funcA = function(i) {
            return 1 - i
          }
          break
        }
        case 'F':
        case 'L':
        case 'T': {
          cardinality = 4
          funcA = function(i) {
            return (i + 1) % 4
          }
          break
        }
        case 'X':
        default: {
          cardinality = 1
          funcA = function(i) {
            return i
          }
          break
        }
      }

      this.actuated = action.length
      firstOccurrence[tile.name] = this.actuated

      for (
        let cardinalityIterator = 0;
        cardinalityIterator < cardinality;
        cardinalityIterator += 1
      ) {
        const items = [
          this.actuated + cardinalityIterator,
          this.actuated + funcA(cardinalityIterator),
          this.actuated + funcA(funcA(cardinalityIterator)),
          this.actuated + funcA(funcA(funcA(cardinalityIterator))),
        ]

        action.push(items)

        this.stationary.push(tile.weight || 1)
      }

      this.actuatedTiles.push(tile.processed)

      for (
        let cardinalityIterator = 1;
        cardinalityIterator < cardinality;
        cardinalityIterator += 1
      ) {
        const rotatedTile = this.counterClockwise(
          this.actuatedTiles[this.actuated + cardinalityIterator - 1]
        )

        this.actuatedTiles.push(rotatedTile)
      }
    })

    this.actuated = action.length

    this.propagator = new Array(4)

    for (let directionalIterator = 0; directionalIterator < 4; directionalIterator += 1) {
      this.propagator[directionalIterator] = new Array(this.actuated)

      for (let actuatedIterator = 0; actuatedIterator < this.actuated; actuatedIterator += 1) {
        this.propagator[directionalIterator][actuatedIterator] = new Array(this.actuated)

        for (
          let reActuatedIterator = 0;
          reActuatedIterator < this.actuated;
          reActuatedIterator += 1
        ) {
          this.propagator[directionalIterator][actuatedIterator][reActuatedIterator] = false
        }
      }
    }

    this.wave = new Array(this.width)
    this.changes = new Array(this.width)

    for (let widthIterator = 0; widthIterator < this.width; widthIterator += 1) {
      this.wave[widthIterator] = new Array(this.height)
      this.changes[widthIterator] = new Array(this.height)

      for (let heightIterator = 0; heightIterator < this.height; heightIterator += 1) {
        this.wave[widthIterator][heightIterator] = new Array(this.actuated)
      }
    }

    this.neighbors = []
    this.actuatedTiles.forEach((tile, index) => {
      const tileEdge = this.edge([1, 0], tile)
      const tileName = objectOccurrence(firstOccurrence, index)
      const tileIndex = index - firstOccurrence[tileName]

      this.actuatedTiles.forEach((subTile, subIndex) => {
        const subTileEdge = this.edge([-1, 0], subTile)
        const subTileName = objectOccurrence(firstOccurrence, subIndex)
        const subTileIndex = subIndex - firstOccurrence[subTileName]

        if (tileEdge.toString() == subTileEdge.toString()) {
          this.neighbors.push({
            left: tileName + (tileIndex ? ' ' + tileIndex : ''),
            right: subTileName + (subTileIndex ? ' ' + subTileIndex : ''),
          })
        }
      })
    })

    _each(this.neighbors, neighbor => {
      const left = neighbor.left.split(' ').filter(function(v) {
        return v.length
      })
      const right = neighbor.right.split(' ').filter(function(v) {
        return v.length
      })

      const leftFirstOccurrence = firstOccurrence[left[0]]
      const leftAlternateIndex = left.length == 1 ? 0 : parseInt(left[1], 10)

      const rightFirstOccurrence = firstOccurrence[right[0]]
      const rightAlternateIndex = right.length == 1 ? 0 : parseInt(right[1], 10)

      const leftDirection = action[leftFirstOccurrence][leftAlternateIndex]
      const downDirection = action[leftDirection][1]
      const rightDirection = action[rightFirstOccurrence][rightAlternateIndex]
      const upDirection = action[rightDirection][1]

      this.propagator[0][rightDirection][leftDirection] = true
      // this.propagator[0][action[rightDirection][6]][action[leftDirection][6]] = true
      // this.propagator[0][action[leftDirection][4]][action[rightDirection][4]] = true
      // this.propagator[0][action[leftDirection][2]][action[rightDirection][2]] = true

      this.propagator[1][upDirection][downDirection] = true
      // this.propagator[1][action[downDirection][6]][action[upDirection][6]] = true
      // this.propagator[1][action[upDirection][4]][action[downDirection][4]] = true
      // this.propagator[1][action[downDirection][2]][action[upDirection][2]] = true
    })

    for (let actuatedIterator = 0; actuatedIterator < this.actuated; actuatedIterator += 1) {
      for (
        let reActuatedIterator = 0;
        reActuatedIterator < this.actuated;
        reActuatedIterator += 1
      ) {
        this.propagator[2][actuatedIterator][reActuatedIterator] = this.propagator[0][
          reActuatedIterator
        ][actuatedIterator]
        this.propagator[3][actuatedIterator][reActuatedIterator] = this.propagator[1][
          reActuatedIterator
        ][actuatedIterator]
      }
    }
  }

  isComplete() {
    return this.complete
  }

  onBoundary(x, y) {
    return !this.periodic && (x < 0 || y < 0 || x >= this.width || y >= this.height)
  }

  clear() {
    for (let widthIterator = 0; widthIterator < this.width; widthIterator += 1) {
      for (let heightIterator = 0; heightIterator < this.height; heightIterator += 1) {
        for (let tileIterator = 0; tileIterator < this.actuated; tileIterator += 1) {
          this.wave[widthIterator][heightIterator][tileIterator] = true
        }

        this.changes[widthIterator][heightIterator] = false
      }
    }

    this.initialized = true
    this.complete = false
  }

  singleIteration(rng) {
    const result = this.observe(rng)

    if (result !== null) {
      this.complete = result

      return !!result
    }

    while (this.propagate()) {}

    return null
  }

  iterate(iterations = 0, rng = Math.random) {
    if (!this.initialized) {
      this.clear()
    }

    for (let iterator = 0; iterator < iterations || iterations === 0; iterator += 1) {
      const result = this.singleIteration(rng)

      if (result !== null) {
        return !!result
      }
    }

    return true
  }

  generate(rng = Math.random) {
    this.clear()

    while (true) {
      const result = this.singleIteration(rng)

      if (result !== null) {
        return !!result
      }
    }
  }

  observe(rng) {
    let minimumWidthIndex = -1
    let minimumHeightIndex = -1

    let minimum = 1000
    let distribution = new Array(this.actuated)

    for (let widthIterator = 0; widthIterator < this.width; widthIterator += 1) {
      const widthWave = this.wave[widthIterator]

      for (let heightIterator = 0; heightIterator < this.height; heightIterator += 1) {
        if (this.onBoundary(widthIterator, heightIterator)) {
          continue
        }

        const heightWave = widthWave[heightIterator]

        let sum = 0
        let entropy = 0
        let noise = 0.000001 * rng()

        for (let tileIterator = 0; tileIterator < this.actuated; tileIterator += 1) {
          distribution[tileIterator] = heightWave[tileIterator]
            ? this.stationary[tileIterator]
            : 0

          sum += distribution[tileIterator]
        }

        if (sum === 0) {
          console.log('bad sum')
          return false
        }

        for (let tileIterator = 0; tileIterator < this.actuated; tileIterator += 1) {
          distribution[tileIterator] /= sum
        }

        for (
          let distributionIterator = 0;
          distributionIterator < distribution.length;
          distributionIterator += 1
        ) {
          const distributionValue = distribution[distributionIterator]

          if (distributionValue > 0) {
            entropy += -distributionValue * Math.log(distributionValue)
          }
        }

        if (entropy > 0 && entropy + noise < minimum) {
          minimum = entropy + noise

          minimumWidthIndex = widthIterator
          minimumHeightIndex = heightIterator
        }
      }
    }

    if (minimumWidthIndex === -1 && minimumHeightIndex === -1) {
      console.log('bad minimums')
      return true
    }

    for (let tileIterator = 0; tileIterator < this.actuated; tileIterator += 1) {
      const minimumWave = this.wave[minimumWidthIndex][minimumHeightIndex]

      distribution[tileIterator] = minimumWave[tileIterator]
        ? this.stationary[tileIterator]
        : 0
    }

    const random = randomIndice(distribution, rng())
    for (let tileIterator = 0; tileIterator < this.actuated; tileIterator += 1) {
      const minimumWave = this.wave[minimumWidthIndex][minimumHeightIndex]

      minimumWave[tileIterator] = tileIterator === random
    }

    this.changes[minimumWidthIndex][minimumHeightIndex] = true

    return null
  }

  propagate() {
    let change = false

    for (let iterationX = 0; iterationX < this.width; iterationX += 1) {
      for (let iterationY = 0; iterationY < this.height; iterationY += 1) {
        for (let direction = 0; direction < 4; direction += 1) {
          let propagationX = iterationX
          let propagationY = iterationY

          if (direction === 0) {
            // LEFT?
            if (iterationX === 0) {
              if (!this.periodic) {
                continue
              } else {
                propagationX = this.width - 1
              }
            } else {
              propagationX = iterationX - 1
            }
          } else if (direction === 1) {
            // BOTTOM?
            if (iterationY === this.height - 1) {
              if (!this.periodic) {
                continue
              } else {
                propagationY = 0
              }
            } else {
              propagationY = iterationY + 1
            }
          } else if (direction === 2) {
            // RIGHT?
            if (iterationX === this.width - 1) {
              if (!this.periodic) {
                continue
              } else {
                propagationX = 0
              }
            } else {
              propagationX = iterationX + 1
            }
          } else {
            // TOP?
            if (iterationY === 0) {
              if (!this.periodic) {
                continue
              } else {
                propagationY = this.height - 1
              }
            } else {
              propagationY = iterationY - 1
            }
          }

          if (!this.changes[propagationX][propagationY]) {
            continue
          }

          let propagationWave = this.wave[propagationX][propagationY]
          let iterationWave = this.wave[iterationX][iterationY]

          for (let iterationTile = 0; iterationTile < this.actuated; iterationTile += 1) {
            if (iterationWave[iterationTile]) {
              let directionalPropagationForTile = this.propagator[direction][iterationTile]
              let bit = false

              for (
                let propagationTile = 0;
                propagationTile < this.actuated && !bit;
                propagationTile += 1
              ) {
                if (propagationWave[propagationTile]) {
                  bit = directionalPropagationForTile[propagationTile]
                }
              }

              if (!bit) {
                iterationWave[iterationTile] = false

                this.changes[iterationX][iterationY] = true
                change = true
              }
            }
          }
        }
      }
    }

    return change
  }

  graphicsComplete(array) {
    var wave, pixelIndex, color, x, y, xt, yt, t

    for (x = 0; x < this.width; x++) {
      for (y = 0; y < this.height; y++) {
        wave = this.wave[x][y]

        for (yt = 0; yt < this.tilesize; yt++) {
          for (xt = 0; xt < this.tilesize; xt++) {
            pixelIndex =
              (x * this.tilesize +
                xt +
                (y * this.tilesize + yt) * this.width * this.tilesize) *
              4

            for (t = 0; t < this.actuated; t++) {
              if (this.wave[x][y][t]) {
                color = this.actuatedTiles[t][yt * this.tilesize + xt]
                array[pixelIndex] = color[0]
                array[pixelIndex + 1] = color[1]
                array[pixelIndex + 2] = color[2]
                array[pixelIndex + 3] = color[3]
              }
            }
          }
        }
      }
    }
  }

  graphicsIncomplete(array, defaultColor) {
    for (let widthIterator = 0; widthIterator < this.width; widthIterator += 1) {
      for (let heightIterator = 0; heightIterator < this.height; heightIterator += 1) {
        const positionWave = this.wave[widthIterator][heightIterator]

        if (!this.changes[widthIterator][heightIterator]) {
          continue
        }

        let [amount, sum] = positionWave.reduce(
          (aggregator, waveTile, index) => {
            if (waveTile) {
              aggregator[0] += 1
              aggregator[1] += this.stationary[index]
            }

            return aggregator
          },
          [0, 0]
        )

        for (
          let tileHeightIterator = 0;
          tileHeightIterator < this.tilesize;
          tileHeightIterator += 1
        ) {
          for (
            let tileWidthIterator = 0;
            tileWidthIterator < this.tilesize;
            tileWidthIterator += 1
          ) {
            const pixelIndex =
              (widthIterator * this.tilesize +
                tileWidthIterator +
                (heightIterator * this.tilesize + tileHeightIterator) *
                  this.width *
                  this.tilesize) *
              4

            if (defaultColor && amount === this.actuated && defaultColor.length === 4) {
              array.set(defaultColor, pixelIndex)
            } else {
              const color = this.actuatedTiles.reduce(
                (pixelColor, tile, index) => {
                  if (positionWave[index]) {
                    const spotColor =
                      tile[tileHeightIterator * this.tilesize + tileWidthIterator]
                    const weight = this.stationary[index]

                    pixelColor[0] += spotColor[0] * weight / sum
                    pixelColor[1] += spotColor[1] * weight / sum
                    pixelColor[2] += spotColor[2] * weight / sum
                    pixelColor[3] += spotColor[3] * weight / sum
                  }

                  return pixelColor
                },
                [0, 0, 0, 0]
              )

              array.set(color, pixelIndex)
            }
          }
        }
      }
    }
  }

  graphics(array, defaultColor) {
    array =
      array || new Uint8Array(this.width * this.tilesize * this.height * this.tilesize * 4)

    if (this.isComplete()) {
      this.graphicsComplete(array)
    } else {
      this.graphicsIncomplete(array, defaultColor)
    }

    return array
  }
}

export default Observanto
