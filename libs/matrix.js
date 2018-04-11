import { isFunction as _isFunction } from 'lodash-es'

const Matriciotta = (function () {
  const identity = function() { return this }

  const _set = function(index, source) { this[index] = source }
  const _get = function(index) { return this[index] }

  const _subArray = (array, subStart, subEnd) => {
    const row = new Object()

    let start = subStart
    for (let iterator = 0; start < subEnd; iterator += 1, start += 1) {
      Object.defineProperty(row, iterator, {
        set: _set.bind(array, start),
        get: _get.bind(array, start),
      })
    }

    return row
  }

  const getOppositeIndex = neighborIndex => {
    return (neighborIndex + 2) % 4
  }

  const maker = function(farray, fwidth, fheight) {
    const matrix = new Object()

    let array = farray
    let width = fwidth
    let height = fheight

    if (!fheight) {
      array = Uint8ClampedArray
      width = farray
      height = fwidth
    }

    const length = width * height
    const buffer = typeof array === 'function' ? new array(length) : array

    if (length > buffer.length && !(buffer instanceof Array)) {
      throw new Error(`Matrix doesn't fit in specified array.`)
    }

    let offset, iterator
    for (offset = iterator = 0; iterator < height; iterator += 1, offset += width) {
      matrix.__defineGetter__(iterator, identity.bind(_subArray(buffer, offset, offset + width)))
    }

    matrix.length = length
    matrix.rows = height
    matrix.columns = width
    matrix.buffer = buffer

    // Operations
    matrix.isUniform = function(term) {
      return this.buffer.every(
        (value, index, array) => value.toString() === (term ? term.toString() : this.buffer[0].toString())
      )
    }

    matrix.clockwise = function(rotationSteps) {
      const steps = rotationSteps % 4
      if (!steps) {
        return this
      }

      const rotatedBuffer = new this.buffer.constructor(this.length)

      for (let iterator = 0; iterator < this.length; iterator += 1) {
        const row = iterator / this.columns >> 0
        const column = iterator % this.columns

        rotatedBuffer[row * this.columns + column] = this.buffer[(this.rows - 1) * this.columns
          - (((row * this.columns + column) % this.rows) * this.columns)
          + ((row * this.columns + column) / this.rows >> 0)]
      }

      return maker(rotatedBuffer, this.rows, this.columns).clockwise(steps - 1)
    }

    matrix.isValidNeighbor = function(neighborTile, direction) {
      const selfEdges = this.edges()

      // this.
    }

    matrix.edge = function(vertical, horizontal) {
      if (horizontal) {
        const horizontalEdge = this.buffer.filter(
          (_, index) => index % this.columns == ( 1 / 2 + horizontal / 2 ) * ( this.columns - 1 )
        )

        return horizontalEdge
      }

      if (vertical) {
        const verticalEdge = this.buffer.filter(
          (_, index) => index < this.columns * ( this.rows ** ( 1 / 2 + vertical / 2)) && index >= ( 1 / 2 + vertical / 2 ) * ( this.columns * this.rows - this.columns)
        )

        return verticalEdge
      }
    }

    matrix.edges = function(mapFunction) {
      const edges = [
        this.edge(-1, 0),
        this.edge(0, 1),
        this.edge(1, 0),
        this.edge(0, -1),
      ]

      if (_isFunction(mapFunction)) {
        return edges.map(mapFunction)
      }

      return edges
    }

    return matrix
  }

  return maker
}())

export default Matriciotta
