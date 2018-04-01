import Vue from 'vue'

import BigNumber from 'bignumber.js'

import {
  has as _has,
  omit as _omit,
  reduce as _reduce,
  flatten as _flatten,
  sample as _sample,
  sampleSize as _sampleSize,
  values as _values
} from 'lodash-es'

import availableActivities from '~/data/activities'
import availableAssets from '~/data/assets'
import availableUpgrades from '~/data/upgrades'

const upgradeKeyTest = Object.keys(availableUpgrades)[0]
export const state = () => ({
  businessOpportunities: 0,

  funds: new BigNumber(0, 10),
  fundsPerSecond: new BigNumber(0, 10),

  currentActivity: _sample(availableActivities),
  activityPower: new BigNumber('2.5', 10),

  assets: {},
  upgrades: {},
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

  buyAsset({ commit, dispatch, getters }, assetUid) {
    const asset = availableAssets[assetUid]

    if (asset.cost.isLessThanOrEqualTo(getters.funds)) {
      commit('buyAsset', assetUid)

      dispatch('recalculateFups')
    }
  },
  buyUpgrade({ commit, dispatch, getters }, upgradeUid) {
    const upgrade = availableUpgrades[upgradeUid]
    const assetAmount = getters.assets[upgrade.entity] || 0
    const upgradeCount = upgrade.count || 0

    if (upgrade.cost.isLessThanOrEqualTo(getters.funds) && assetAmount >= upgradeCount) {
      commit('buyUpgrade', upgradeUid)

      dispatch('recalculateFups')
    }
  },

  operationalActivity({ commit, getters }) {
    commit('addFunds', getters.activityPower)

    commit('changeActivity')
  },

  collectFups({ commit, getters }) {
    commit('addFunds', getters.fundsPerSecond)
  },
}

export const getters = {
  assets: state => state.assets,
  upgrades: state => state.upgrades,

  funds: state => state.funds,
  fundsPerSecond: state => state.fundsPerSecond,

  currentActivity: state => state.currentActivity,
  activityPower: state => state.activityPower,

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
  addFunds(state, funds) {
    state.funds = state.funds.plus(funds)
  },

  setFups(state, fups) {
    state.fundsPerSecond = new BigNumber(fups)
  },

  changeActivity(state) {
    const sample = _sampleSize(availableActivities, 2)

    state.currentActivity = state.currentActivity === sample[0] ? sample[1] : sample[0]
  },

  buyAsset(state, assetUid) {
    const asset = availableAssets[assetUid]

    state.funds = state.funds.minus(asset.cost)

    if (_has(state.assets, assetUid)) {
      state.assets[assetUid] += 1
    } else {
      state.assets[assetUid] = 1
    }
  },

  buyUpgrade(state, upgradeUid) {
    const upgrade = availableUpgrades[upgradeUid]

    state.funds = state.funds.minus(upgrade.cost)

    if (_has(state.upgrades, upgrade.entity)) {
      Vue.set(state.upgrades, upgrade.entity, [
        ...state.upgrades[upgrade.entity],

        upgradeUid,
      ])
    } else {
      Vue.set(state.upgrades, upgrade.entity, [
        upgradeUid,
      ])
    }
  },
}
