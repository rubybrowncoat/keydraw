import { isArray as _isArray, map as _map, random as _random, reduce as _reduce } from 'lodash-es'

const ENTROPY = -348273498

class Distribuzia {
  constructor(funiformity, flength = 0, normalized = false) {
    this.length = flength
    this.ordered = []

    this.cachedEntropy = ENTROPY

    if (_isArray(funiformity)) {
      this.length = funiformity.length
      this.ordered = funiformity.map(probability => Math.log(probability))
    } else {
      if (this.length) {
        this.ordered = new Array(this.length).fill(Math.log(funiformity))
      }
    }

    if (normalized) {
      this.normalize()
    }
  }

  add(distribution) {
    const addedOrdered = []

    for (let iterator = 0; iterator < distribution.length; iterator += 1) {
      addedOrdered[iterator] = Math.log(
        Math.exp(distribution.ordered[iterator]) + Math.exp(this.ordered[iterator])
      )
    }

    this.ordered = addedOrdered

    this.invalidateEntropy()

    return this
  }

  multiply(distribution) {
    const multipliedOrdered = []

    for (let iterator = 0; iterator < distribution.length; iterator += 1) {
      multipliedOrdered[iterator] = distribution.ordered[iterator] + this.ordered[iterator]
    }

    this.ordered = multipliedOrdered

    this.invalidateEntropy()

    return this
  }

  normalize() {
    const totalProbability = this.getTotalProbability()

    if (totalProbability > 0) {
      const normalizedOrdered = _map(this.ordered, probability => probability - Math.log(totalProbability))

      this.ordered = normalizedOrdered

      this.invalidateEntropy()
    }

    return this
  }

  getTotalProbability() {
    return _reduce(
      this.ordered,
      (sum, probability) => sum + Math.exp(probability),
      0
    )
  }

  getProbability(index) {
    return Math.exp(this.ordered[index])
  }

  setProbability(index, probability) {
    const value = Math.log(probability)

    this.ordered[index] = value

    this.invalidateEntropy()

    return value
  }

  weightedSelection() {
    let random = _random(true)

    for (let iterator = 0; iterator < this.length; iterator += 1) {
      const tileProbability = this.getProbability(iterator)

      random = random - tileProbability

      if (random <= 0) {
        return iterator
      }
    }

    return false
  }

  entropy() {
    if (!this.cachedEntropy == ENTROPY) {
      return this.cachedEntropy
    }

    return this.calculateEntropy()
  }

  calculateEntropy() {
    const entropy = this.ordered.reduce((aggregate, probability) => {
      // if (probability != 0) {
        return aggregate + probability * Math.exp(probability)
      // }

      return aggregate
    }, 0)

    this.cachedEntropy = entropy

    return entropy
  }

  invalidateEntropy() {
    this.cachedEntropy = ENTROPY
  }

  clone() {
    return new Distribuzia(_map(this.ordered, probability => Math.exp(probability)))
  }

  toArray() {
    return this.ordered.map(probability => Math.exp(probability))
  }
}

export default Distribuzia
