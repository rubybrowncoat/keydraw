import {
  chunk as _chunk,
  every as _every
} from 'lodash-es'

import UidGenerator from '~/libs/uid'
const tileUids = UidGenerator('tile-')

class Tilesettolo {
  constructor(fbuffer, fsize, fwidth, fheight) {
    this.tileSize = fsize
    this.occupancy = this.tileSize + 1

    this.width = fwidth
    this.height = fheight

    this.buffer = fbuffer

    this.tiles = []
    this.ordered = []

    this.initialize()
  }

  initialize() {
    const setData = new ImageData(this.buffer, this.width, this.height)
    const setCanvas = document.createElement('canvas')
    const setContext = setCanvas.getContext('2d')

    setCanvas.width = this.width
    setCanvas.height = this.height

    setContext.putImageData(setData, 0, 0)

    console.log('tileSize', this.tileSize)

    // Make Tileset
    let tileNumber = 0
    for (
      let widthIterator = 0; widthIterator < this.width / this.occupancy; widthIterator += 1
    ) {
      for (
        let heightIterator = 0; heightIterator < this.height / this.occupancy; heightIterator += 1
      ) {
        tileNumber += 1

        const xPosition = widthIterator * this.occupancy
        const yPosition = heightIterator * this.occupancy

        const tilePixels = setContext.getImageData(
          xPosition,
          yPosition,
          this.tileSize,
          this.tileSize
        ).data

        const processedTile = _chunk(tilePixels, 4)

        const isWhite = tilePixels.every((pixel, index, array) => pixel === 255)

        if (!isWhite) {
          const preventionPixel = setContext.getImageData(xPosition + this.tileSize, yPosition, 1, 1).data
          const prevented =
            preventionPixel.toString() !=
            new Uint8ClampedArray([255, 255, 255, 255]).toString()

          if (!prevented) {
            const edges = this.edges(processedTile)
            const [rightEdge, topEdge, leftEdge, bottomEdge] = edges

            let symmetry = 'F'
            if (this.edgeCompare(...edges)) {
              symmetry = 'X'
            } else if (
              this.edgeCompare(leftEdge, rightEdge) &&
              this.edgeCompare(topEdge, bottomEdge)
            ) {
              symmetry = 'I'
            } else if (
              this.edgeCompare(leftEdge, rightEdge) ||
              this.edgeCompare(topEdge, bottomEdge)
            ) {
              symmetry = 'T'
            } else if (
              this.edgeCompareReversed(leftEdge, bottomEdge) &&
              this.edgeCompareReversed(leftEdge, rightEdge)
            ) {
              symmetry = 'S'
            } else if (
              this.edgeCompareReversed(leftEdge, bottomEdge) ||
              this.edgeCompareReversed(rightEdge, topEdge)
            ) {
              symmetry = 'L'
            }

            const likelihoodPixels = setContext.getImageData(xPosition, yPosition + this.tileSize, this.tileSize + 1, 1)
              .data
            const binaryWeight = _chunk(likelihoodPixels, 4).map(
              pixel => pixel.every(rgba => rgba === 255) ? 0 : 1
            ).join('')
            const intWeight = parseInt(binaryWeight, 2)
            const likelihoodProbability = intWeight * ((1 - 0.01) / ((this.tileSize + 1) ** 2 - 1)) + 0.01

            const tile = {
              name: tileUids.generate(),
              bitmap: tilePixels,
              processed: processedTile,
              symmetry,
              weight: likelihoodProbability,
            }

            this.tiles.push(tile)
            this.ordered.push(tile.name)
          }
        }
      }
    }
  }

  edge([horizontal, vertical], tile) {
    if (horizontal) {
      const horizontalEdge = tile.filter(
        (_, index) => index % this.tileSize == (1 / 2 + horizontal / 2) * (this.tileSize - 1)
      )

      return horizontalEdge
    }

    if (vertical) {
      const verticalEdge = tile.filter(
        (_, index) =>
        index < this.tileSize ** ((vertical + 3) / 2) &&
        index >= 1 / 2 * this.tileSize * (this.tileSize - 1) * (vertical + 1)
      )

      return verticalEdge
    }
  }

  edges(tile) {
    return [
      this.edge([1, 0], tile),
      this.edge([0, -1], tile),
      this.edge([-1, 0], tile),
      this.edge([0, 1], tile),
    ]
  }

  edgeCompare(head, ...checks) {
    const control = head.toString()

    return _every(checks, check => {
      return check.toString() == control
    })
  }

  edgeCompareReversed(firstEdge, secondEdge) {
    secondEdge.reverse()

    return firstEdge.toString() == secondEdge.toString()
  }
}

export default Tilesettolo
