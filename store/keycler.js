import BigNumber from 'bignumber.js'

import { omit as _omit, reduce as _reduce, flatten as _flatten, values as _values } from 'lodash'

import availableAssets from '~/data/assets'
import availableUpgrades from '~/data/upgrades'

const upgradeKeyTest = Object.keys(availableUpgrades)[0]
export const state = () => ({
  businessOpportunities: 0,

  funds: new BigNumber(0, 10),
  fundsPerSecond: new BigNumber(0, 10),

  activityPower: new BigNumber('2.5', 10),

  assets: {
    'asset-qe6yrl': 10,
    'asset-8enzu3': 5,
  },
  upgrades: {
    [availableUpgrades[upgradeKeyTest].entity]: [upgradeKeyTest],
  },
})

export const actions = {
  recalculateFups({ commit, getters }) {
    const totalFups = _reduce(
      getters.assets,
      (total, amount, key) => {
        const asset = availableAssets[key]
        const assetFups = asset.fups
        const upgradedAssetFups = _reduce(getters.upgrades[key], (total, key) => {
          const upgrade = availableUpgrades[key]
          const upgradeFups = upgrade.fups

          return total.plus(upgradeFups)
        }, new BigNumber(assetFups, 10))
        const totalAssetFups = upgradedAssetFups.multipliedBy(amount)

        return total.plus(totalAssetFups)
      },
      new BigNumber(0, 10)
    )

    commit('setFups', totalFups)
  },
}

export const getters = {
  assets: state => state.assets,
  upgrades: state => state.upgrades,

  availableAssets: () => availableAssets,
  availableUpgrades: state => _omit(availableUpgrades, _flatten(_values(state.upgrades))),

  test: state => {
    return _reduce(
      state.assets,
      (total, amount, key) => {
        const asset = availableAssets[key]
        const assetFups = asset.fups
        const upgradedAssetFups = _reduce(state.upgrades[key], (total, key) => {
          const upgrade = availableUpgrades[key]
          const upgradeFups = upgrade.fups

          return total.plus(upgradeFups)
        }, new BigNumber(assetFups, 10))
        const totalAssetFups = upgradedAssetFups.multipliedBy(amount)

        console.log(asset.name, amount, assetFups.toString(), upgradedAssetFups.toString(), totalAssetFups.toString())
        return total.plus(totalAssetFups)
      },
      new BigNumber(0, 10)
    ).toString()
  },
}

export const mutations = {
  setFups(state, fups) {
    state.fundsPerSecond = fups
  }
}
