import Decimal from 'decimal.js'

import { isArray as _isArray, map as _map, reduce as _reduce } from 'lodash-es'

class Distribuzia {
  constructor(funiformity, flength = 0) {
    this.length = flength
    this.ordered = []

    if (_isArray(funiformity)) {
      this.length = funiformity.length
      this.ordered = funiformity.map(probability => Decimal.ln(probability))
    } else {
      if (this.length) {
        this.ordered = new Array(this.length).fill(Decimal.ln(funiformity))
        console.log('filled', this.ordered)
      }
    }
  }

  add(distribution) {
    const addedOrdered = []
    for (let iterator = 0; iterator < distribution.length; iterator += 1) {
      addedOrdered[iterator] = Decimal.ln(
        Decimal.exp(distribution.ordered[iterator]).add(Decimal.exp(this.ordered[iterator]))
      )
    }

    this.ordered = addedOrdered

    return addedOrdered
  }

  getTotalProbability() {
    console.log(this.ordered)

    return _reduce(
      this.ordered,
      (sum, probability) => sum.plus(Decimal.exp(probability)),
      new Decimal(0)
    )
  }

  getProbability(index) {
    return this.ordered[index]
  }

  setProbability(index, probability) {
    const value = Decimal.ln(probability)

    this.ordered[index] = value

    return value
  }

  toNormalized() {
    const totalProbability = this.getTotalProbability()

    if (totalProbability > 0) {
      const normalizedOrdered = _map(this.ordered, probability => {
        return probability.minus(Decimal.ln(totalProbability))
      })

      return new Distribuzia(normalizedOrdered)
    }

    return this
  }

  toStringArray() {
    return this.ordered.map(decimal => decimal.toString())
  }
}

export default Distribuzia
