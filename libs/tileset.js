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

    // Make Tileset
    let tileNumber = 0
    for (
      let widthIterator = 0;
      widthIterator < this.width / this.occupancy;
      widthIterator += 1
    ) {
      for (
        let heightIterator = 0;
        heightIterator < this.height / this.occupancy;
        heightIterator += 1
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

        const isWhite = tilePixels.every((pixel, index, array) => pixel === 255)

        if (!isWhite) {
          const preventionPixel = setContext.getImageData(xPosition + 1, yPosition + 3, 1, 1)
            .data
          const prevented =
            preventionPixel.toString() === new Uint8ClampedArray([250, 5, 5, 255]).toString()

          if (!prevented) {
            const blackCheck = new Uint8ClampedArray([5, 5, 5, 255]).toString()

            const symmetry =
              setContext.getImageData(xPosition + 3, yPosition, 1, 1).data.toString() ==
              blackCheck
                ? 'I'
                : setContext.getImageData(xPosition + 3, yPosition + 1, 1, 1).data.toString() ==
                  blackCheck
                  ? 'L'
                  : setContext.getImageData(xPosition + 3, yPosition + 2, 1, 1).data.toString() ==
                    blackCheck
                    ? 'T'
                    : setContext
                        .getImageData(xPosition + 3, yPosition + 3, 1, 1)
                        .data.toString() == blackCheck
                      ? 'S'
                      : 'X'

            const likelyhoodPixel = setContext.getImageData(xPosition, yPosition + 3, 1, 1)
              .data
            const likelyhoodProbability = 1 - likelyhoodPixel[0] / 255

            const tile = {
              name: tileUids.generate(),
              bitmap: tilePixels,
              symmetry,
              weight: likelyhoodProbability,
            }

            this.tiles.push(tile)
            this.ordered.push(tile.name)
          }
        }
      }
    }
  }
}

export default Tilesettolo
