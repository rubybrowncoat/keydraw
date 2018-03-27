import BigNumber from 'bignumber.js'

import { keyBy as _keyBy } from 'lodash'

import UidGenerator from '../libs/uid'

const assetUids = UidGenerator('asset-')

const assets = [
  {
    name: 'Minimum Wage Worker',
    fups: new BigNumber('.1'),

    cost: new BigNumber('15'),
  },
  {
    name: 'Cubicle',
    fups: new BigNumber('.3'),

    cost: new BigNumber('100'),
  },
  {
    name: 'Hardware',
    fups: new BigNumber('1'),

    cost: new BigNumber('1250'),
  },
  {
    name: 'Salary Employee',
    fups: new BigNumber('2'),

    cost: new BigNumber('1500'),
  },
  {
    name: 'HR Department',
    fups: new BigNumber('.5'),

    cost: new BigNumber('2000'),
  },
  {
    name: 'Accounting Department',
    fups: new BigNumber('3'),

    cost: new BigNumber('5000'),
  },
  {
    name: 'Benefits Package',
    fups: new BigNumber('3'),

    cost: new BigNumber('25000'),
  },
  {
    name: 'Upper Management',
    fups: new BigNumber('1'),

    cost: new BigNumber('50000'),
  },
  {
    name: 'Executive',
    fups: new BigNumber('10'),

    cost: new BigNumber('100000'),
  },
  {
    name: 'Office',
    fups: new BigNumber('20'),

    cost: new BigNumber('500000'),
  },
  {
    name: 'Office Building',
    fups: new BigNumber('30'),

    cost: new BigNumber('2000000'),
  },
  {
    name: 'Corporate Headquarters',
    fups: new BigNumber('50'),

    cost: new BigNumber('50000000'),
  },
]

export default _keyBy(assets, asset => assetUids.generate())
