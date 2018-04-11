import Decimal from 'decimal.js'

const assets = {
  'asset-qe6yrl': {
    name: 'Minimum Wage Worker',

    fups: new Decimal('.1'),
    cost: new Decimal('15'),

    key: 'w',
  },
  'asset-cu56f9': {
    name: 'Cubicle',

    fups: new Decimal('.3'),
    cost: new Decimal('100'),

    key: 'c',
  },
  'asset-8enzu3': {
    name: 'Hardware',

    fups: new Decimal('1'),
    cost: new Decimal('1250'),

    key: 'h',
  },
  'asset-55hd3j': {
    name: 'Specialized Software',

    fups: new Decimal('.8'),
    cost: new Decimal('1250'),

    key: 's',
  },
  'asset-ghlky1': {
    name: 'Salary Employee',

    fups: new Decimal('2'),
    cost: new Decimal('1500'),

    key: 'e',
  },
  'asset-8l8lq4': {
    name: 'HR Department',

    fups: new Decimal('.5'),
    cost: new Decimal('2000'),

    key: 'r',
  },
  'asset-lbz9zj': {
    name: 'Accounting Department',

    fups: new Decimal('3'),
    cost: new Decimal('5000'),

    key: 'a',
  },
  'asset-452lu9': {
    name: 'Benefits Package',

    fups: new Decimal('3'),
    cost: new Decimal('25000'),

    key: 'b',
  },
  'asset-13bmea': {
    name: 'Upper Management',

    fups: new Decimal('1'),
    cost: new Decimal('50000'),

    key: 'm',
  },
  'asset-cbkeno': {
    name: 'Executive',
    fups: new Decimal('10'),

    cost: new Decimal('100000'),

    key: 'x',
  },
  'asset-0prka1': {
    name: 'Office',

    fups: new Decimal('20'),
    cost: new Decimal('500000'),

    key: 'o',
  },
  'asset-n5quwx': {
    name: 'Office Building',

    fups: new Decimal('30'),
    cost: new Decimal('2000000'),

    key: 'l',
  },
  'asset-cxtzpp': {
    name: 'Corporate Headquarters',

    fups: new Decimal('50'),
    cost: new Decimal('50000000'),

    key: 'q',
  },
}

export default assets
