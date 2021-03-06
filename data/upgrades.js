import Decimal from 'decimal.js'

import { keyBy as _keyBy } from 'lodash-es'

import UidGenerator from '~/libs/uid'

const upgradeUids = UidGenerator('upgrade-')

const upgrades = [
  {
    entity: 'asset-qe6yrl',

    name: 'Positive Reinforcement',
    description:
      'Studies have shown that training employees is the same as training a dog: use lots of positive reinforcement to get them to behave correctly.',

    fups: new Decimal('.05'),
    cost: new Decimal('500'),
  },
  {
    entity: 'asset-qe6yrl',
    count: 10,

    name: 'Mentoring Program',
    description:
      'While reading tutorial after tutorial, binder upon binder, ebook over ebook of information is fun for some people, it is easier to learn and retain information from a good teacher.',

    fups: new Decimal('.1'),
    cost: new Decimal('1500'),
  },
  {
    entity: 'asset-qe6yrl',
    count: 100,

    name: 'Better Scheduling',
    description:
      "When all of your minimum wage employees work under 35 hours a week, there's no need to cover health insurance mandates!",

    fups: new Decimal('.15'),
    cost: new Decimal('30000'),
  },
]

export default _keyBy(upgrades, upgrade => upgradeUids.generate())
