import BigNumber from 'bignumber.js'

import availableAssets from '../data/assets'

console.log(availableAssets)

export const state = () => ({
  funds: new BigNumber(0, 10),
  fundsPerSecond: new BigNumber(0, 10),

  assets: {},
  upgrades: {},
})

export const actions = {

}

export const getters = {

}

export const mutations = {

}
