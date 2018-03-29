import BigNumber from 'bignumber.js'

const assets = {
  'asset-qe6yrl': {
    name: 'Minimum Wage Worker',

    fups: new BigNumber('.1'),
    cost: new BigNumber('15'),
  },
  'asset-cu56f9': {
    name: 'Cubicle',

    fups: new BigNumber('.3'),
    cost: new BigNumber('100'),
  },
  'asset-8enzu3': {
    name: 'Hardware',

    fups: new BigNumber('1'),
    cost: new BigNumber('1250'),
  },
  'asset-55hd3j': {
    name: 'Specialized Software',

    fups: new BigNumber('.8'),
    cost: new BigNumber('1250'),
  },
  'asset-ghlky1': {
    name: 'Salary Employee',

    fups: new BigNumber('2'),
    cost: new BigNumber('1500'),
  },
  'asset-8l8lq4': {
    name: 'HR Department',

    fups: new BigNumber('.5'),
    cost: new BigNumber('2000'),
  },
  'asset-lbz9zj': {
    name: 'Accounting Department',

    fups: new BigNumber('3'),
    cost: new BigNumber('5000'),
  },
  'asset-452lu9': {
    name: 'Benefits Package',

    fups: new BigNumber('3'),
    cost: new BigNumber('25000'),
  },
  'asset-13bmea': {
    name: 'Upper Management',

    fups: new BigNumber('1'),
    cost: new BigNumber('50000'),
  },
  'asset-cbkeno': {
    name: 'Executive',
    fups: new BigNumber('10'),

    cost: new BigNumber('100000'),
  },
  'asset-0prka1': {
    name: 'Office',

    fups: new BigNumber('20'),
    cost: new BigNumber('500000'),
  },
  'asset-n5quwx': {
    name: 'Office Building',

    fups: new BigNumber('30'),
    cost: new BigNumber('2000000'),
  },
  'asset-cxtzpp': {
    name: 'Corporate Headquarters',

    fups: new BigNumber('50'),
    cost: new BigNumber('50000000'),
  },
}

export default assets
