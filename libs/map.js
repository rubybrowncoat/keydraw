const Mapperotta = (function () {
  const maker = function(fwidth, fheight) {
    const map = new Object()

    const width = fwidth
    const height = fheight

    map.buffer = Array(width * height)

    map.rows = height
    map.columns = width

    map.get = function([x, y]) {
      if (x < 0 || x >= this.columns) {
        return false
      }

      if (y < 0 || y >= this.rows) {
        return false
      }

      return this.buffer[y * this.columns + x]
    }

    map.set = function([x, y], value) {
      if (x < 0 || x >= this.columns) {
        return false
      }

      if (y < 0 || y >= this.rows) {
        return false
      }

      this.buffer[y * this.columns + x] = value
    }

    map.getNeighbors = function([x, y]) {
      return [
        y >= 1 ? this.get([x, y - 1]) : false,
        x < this.columns - 1 ? this.get([x + 1, y]) : false,
        y < this.rows - 1 ? this.get([x, y + 1]) : false,
        x >= 1 ? this.get([x - 1, y]) : false,
      ]
    }

    map.getNeighborLocations = function([x, y]) {
      return [
        y >= 1 ? [x, y - 1] : false,
        x < this.columns - 1 ? [x + 1, y] : false,
        y < this.rows - 1 ? [x, y + 1] : false,
        x >= 1 ? [x - 1, y] : false,
      ]
    }

    return map
  }

  return maker
}())

export default Mapperotta
