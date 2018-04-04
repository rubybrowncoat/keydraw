class Matriciotta {

}

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
    matrix.array = buffer

    // Operations
    matrix.isUniform = (term) => buffer.every((value, index, array) => value.toString() === (term ? term.toString() : array[0].toString()))

    matrix.clockwise = function(rotationSteps) {
      const steps = rotationSteps % 4
      if (!steps) {
        return this
      }

      const rotatedBuffer = new this.array.constructor(this.length)

      for (let iterator = 0; iterator < this.length; iterator += 1) {
        const row = iterator / this.columns >> 0
        const column = iterator % this.columns

        rotatedBuffer[row * this.columns + column] = this.array[(this.rows - 1) * this.columns
          - (((row * this.columns + column) % this.rows) * this.columns)
          + ((row * this.columns + column) / this.rows >> 0)]
      }

      return maker(rotatedBuffer, this.columns, this.rows).clockwise(steps - 1)
    }

    return matrix
  }

  return maker
}())

export default Matriciotta
