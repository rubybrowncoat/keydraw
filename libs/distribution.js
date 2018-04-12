import Decimal from 'decimal.js'

import { isArray as _isArray, map as _map, reduce as _reduce } from 'lodash-es'

const ENTROPY = new Decimal('-348273498')

class Distribuzia {
  constructor(funiformity, flength = 0, normalized = false) {
    this.length = flength
    this.ordered = []

    this.cachedEntropy = ENTROPY

    if (_isArray(funiformity)) {
      this.length = funiformity.length
      this.ordered = funiformity.map(probability => Decimal.ln(probability))
    } else {
      if (this.length) {
        this.ordered = new Array(this.length).fill(Decimal.ln(funiformity))
      }
    }

    if (normalized) {
      this.normalize()
    }
  }

  add(distribution) {
    const addedOrdered = []
    for (let iterator = 0; iterator < distribution.length; iterator += 1) {
      addedOrdered[iterator] = Decimal.ln(Decimal.exp(distribution.ordered[iterator]).plus(Decimal.exp(this.ordered[iterator])))
    }

    this.ordered = addedOrdered

    this.invalidateEntropy()

    return this
  }

  multiply(distribution) {
    const multipliedOrdered = []
    for (let iterator = 0; iterator < distribution.length; iterator += 1) {
      multipliedOrdered[iterator] = distribution.ordered[iterator].plus(this.ordered[iterator])
    }

    this.ordered = multipliedOrdered

    this.invalidateEntropy()

    return this
  }

  normalize() {
    const totalProbability = this.getTotalProbability()
    if (totalProbability > 0) {
      const normalizedOrdered = _map(this.ordered, probability => probability.minus(Decimal.ln(totalProbability)))

      this.ordered = normalizedOrdered

      this.invalidateEntropy()
    }

    return this
  }

  getTotalProbability() {
    return _reduce(
      this.ordered,
      (sum, probability) => sum.plus(Decimal.exp(probability)),
      new Decimal(0)
    )
  }

  getProbability(index) {
    return Decimal.exp(this.ordered[index])
  }

  setProbability(index, probability) {
    const value = Decimal.ln(probability)

    this.ordered[index] = value

    this.invalidateEntropy()

    return value
  }

  weightedSelection() {
    let random = Decimal.random()

    for (let iterator = 0; iterator < this.length; iterator += 1) {
      const tileProbability = this.getProbability(iterator)

      random = random.minus(tileProbability)

      if (random.lte(0)) {
        return iterator
      }
    }

    return 0
  }

  entropy() {
    if (!this.cachedEntropy.equals(ENTROPY)) {
      return this.cachedEntropy
    }

    return this.calculateEntropy()
  }

  calculateEntropy() {
    const entropy = this.ordered.reduce((aggregate, probability) => {
      if (!probability.isZero()) {
        return aggregate.plus(probability.times(Decimal.exp(probability)))
      }

      return aggregate
    }, new Decimal(0))

    this.cachedEntropy = entropy

    return entropy
  }

  invalidateEntropy() {
    this.cachedEntropy = ENTROPY
  }

  clone() {
    return new Distribuzia(_map(this.ordered, probability => probability.exp()))
  }

  toStringArray() {
    return this.ordered.map(decimal => decimal.exp().toString())
  }
}

export default Distribuzia
