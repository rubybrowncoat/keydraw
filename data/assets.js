import BigNumber from 'bignumber.js'

const assets = {
  'asset-qe6yrl': {
    name: 'Minimum Wage Worker',

    fups: new BigNumber('.1'),
    cost: new BigNumber('15'),

    key: 'w',
  },
  'asset-cu56f9': {
    name: 'Cubicle',

    fups: new BigNumber('.3'),
    cost: new BigNumber('100'),

    key: 'c',
  },
  'asset-8enzu3': {
    name: 'Hardware',

    fups: new BigNumber('1'),
    cost: new BigNumber('1250'),

    key: 'h',
  },
  'asset-55hd3j': {
    name: 'Specialized Software',

    fups: new BigNumber('.8'),
    cost: new BigNumber('1250'),

    key: 's',
  },
  'asset-ghlky1': {
    name: 'Salary Employee',

    fups: new BigNumber('2'),
    cost: new BigNumber('1500'),

    key: 'e',
  },
  'asset-8l8lq4': {
    name: 'HR Department',

    fups: new BigNumber('.5'),
    cost: new BigNumber('2000'),

    key: 'r',
  },
  'asset-lbz9zj': {
    name: 'Accounting Department',

    fups: new BigNumber('3'),
    cost: new BigNumber('5000'),

    key: 'a',
  },
  'asset-452lu9': {
    name: 'Benefits Package',

    fups: new BigNumber('3'),
    cost: new BigNumber('25000'),

    key: 'b',
  },
  'asset-13bmea': {
    name: 'Upper Management',

    fups: new BigNumber('1'),
    cost: new BigNumber('50000'),

    key: 'm',
  },
  'asset-cbkeno': {
    name: 'Executive',
    fups: new BigNumber('10'),

    cost: new BigNumber('100000'),

    key: 'x',
  },
  'asset-0prka1': {
    name: 'Office',

    fups: new BigNumber('20'),
    cost: new BigNumber('500000'),

    key: 'o',
  },
  'asset-n5quwx': {
    name: 'Office Building',

    fups: new BigNumber('30'),
    cost: new BigNumber('2000000'),

    key: 'l',
  },
  'asset-cxtzpp': {
    name: 'Corporate Headquarters',

    fups: new BigNumber('50'),
    cost: new BigNumber('50000000'),

    key: 'q',
  },
}

export default assets
