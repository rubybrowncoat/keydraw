<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <information />

      <div class="keycler">
        <div class="activity menuItem">
          <span class="txtLabel">SPACEBAR</span>
          {{ currentActivity }}
        </div>
        <div class="assets">
          <div
            :class="[
              'asset',
              'menuItem',
              {
                costly: asset.cost.isGreaterThan(funds),
                hidden: asset.cost.isGreaterThan(funds.multipliedBy(1.5)) && !assets[key],
              },
            ]"
            v-for="(asset, key) in availableAssets"
            :key="key">
            <span class="txtLabel">{{ asset.key }}</span>
            {{ asset.name }}
            <span class="txtLabel">€{{ asset.cost.toFormat() }}</span>
            <span class="quantity">{{ assets[key] || 0 }}</span>
          </div>
        </div>
        <div class="upgrades">
          <div
            :class="[
              'upgrade',
              'menuItem',
              {
                costly: upgrade.cost.isGreaterThan(funds),
                hidden:
                  upgrade.cost.isGreaterThan(funds.multipliedBy(1.5))
                  || (assets[upgrade.entity] || 0) < (upgrade.count || 0),
              },
            ]"
            v-for="(upgrade, key) in availableUpgrades"
            :key="key">
            <span class="txtLabel">SHIFT + {{ availableAssets[upgrade.entity].key }}</span>
            {{ upgrade.name }}
            <span class="txtLabel">€{{ upgrade.cost.toFormat() }}</span>
            <span class="description">
              {{ upgrade.description }}
            </span>
          </div>
        </div>
      </div>

      <action-bar kind="generic" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keycler {
  position: relative;

  width: calc(100vw - 100px);
  padding: 84px 0 94px;

  left: 50%;

  transform: translateX(-50%);

  text-transform: uppercase;
  font-size: 22px;

  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.activity {
  display: block;
}

.assets, .upgrades {
  width: 50%;

  .txtLabel {
    min-width: auto;
  }
}

.assets {
  float: left;

  padding: 20px 10px 0 0;
}

.upgrades {
  float: right;

  padding: 20px 0 0 10px;
}

.asset, .upgrade {
  display: block;

  margin-bottom: 5px;
  margin-left: 0;

  &.costly {
    opacity: .5;
  }

  &.hidden {
    display: none;
  }
}

.asset {
  .quantity {
    float: right;
  }
}

.upgrade {
  height: auto;

  .description {
    display: block;
    font-size: 14px;
    white-space: normal;
  }
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex'

import { findKey as _findKey } from 'lodash-es'

import ActionBar from '~/components/ActionBar'
import Information from '~/components/Keycler/Information'

let loopActive = false
let loopBreak = false

export default {
  transition: 'slide-left',
  components: {
    ActionBar,
    Information,
  },
  data: () => ({
    fps: 1,
  }),
  computed: {
    ...mapGetters('theme', [
      'currentTheme',
    ]),

    ...mapGetters('keycler', [
      'funds',

      'currentActivity',

      'assets',

      'availableAssets',
      'availableUpgrades',
    ]),

    ...mapGetters('keytsh', [
      'keytshCollapsed',
    ]),
  },
  methods: {
    ...mapActions('keycler', [
      'operationalActivity',
      'collectFups',

      'buyAsset',
      'buyUpgrade',
    ]),
    ...mapActions('keytsh', [
      'toggleKeytshCollapse',
    ]),

    keyOperation(evt) {
      if (this.keytshCollapsed) {
        evt.preventDefault()

        switch (evt.key) {
          case 'Backspace': {
            // BACKSPACE
            this.$router.push('/')
            break
          }
          case ' ': {
            // SPACE
            this.operationalActivity()
            break
          }
          default: {
            if (evt.shiftKey || evt.ctrlKey) {
              const assetUid = _findKey(this.availableAssets, ['key', evt.key.toLowerCase()])

              if (assetUid) {
                const upgradeUid = _findKey(this.availableUpgrades, ['entity', assetUid])

                if (upgradeUid) {
                  const upgrade = this.availableUpgrades[upgradeUid]

                  if (upgrade.cost.isLessThanOrEqualTo(this.funds)) {
                    this.buyUpgrade(upgradeUid)
                  }
                }
              }
            } else {
              const assetUid = _findKey(this.availableAssets, ['key', evt.key])

              if (assetUid) {
                const asset = this.availableAssets[assetUid]

                if (asset.cost.isLessThanOrEqualTo(this.funds)) {
                  this.buyAsset(assetUid)
                }
              }
            }
          }
        }
      }

      switch (evt.key) {
        case '!': {
          this.toggleKeytshCollapse()
          break
        }
      }
    },

    keyNeutralization(evt) {
      if (this.keytshCollapsed) {
        switch (evt.key) {
          case ' ': {
            // SPACE
            evt.preventDefault()
            break
          }
        }
      }
    },

    gameLogic() {
      this.collectFups()
    },

    gameLoop() {
      const interval = 1000 / this.fps

      let then = Date.now()

      const loop = time => {
        if (loopBreak) {
          loopBreak = false

          return
        }

        requestAnimationFrame(loop)

        const now = Date.now()
        const delta = now - then

        if (delta > interval) {
          then = now - (delta % interval)

          this.gameLogic()
        }
      }

      loopActive = true
      loop()
    },
  },
  beforeMount() {
    window.addEventListener('keyup', this.keyOperation)
    window.addEventListener('keydown', this.keyNeutralization)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyOperation)
    window.removeEventListener('keydown', this.keyNeutralization)
  },
  mounted() {
    if (!loopActive) {
      this.gameLoop()
    }
  },
}
</script>
