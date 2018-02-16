<template>
  <div class="base-canvas" :class="{
    hide: !properties.shown || inactive,
  }">
    <div
      class="display-grid"
      :style="{
        backgroundSize: `${keySize}px ${keySize}px`,
        width: `${gridWidth * keySize}px`,
        height: `${gridHeight * keySize}px`,
      }"
    >
      <div
        v-for="(active, key) in actives"
        v-if="active.top < gridHeight && active.left < gridWidth"
        class="active-key"
        :key="key"
        :style="{
          backgroundColor: active.status || 'transparent',
          top: `${active.top * keySize}px`,
          left: `${active.left * keySize}px`,
          width: `${keySize}px`,
          height: `${keySize}px`,
        }"
      />
      <div
        class="keyboard"
        v-show="properties.shown && !inactive"
        :style="{
          transform: `translate3d(+${keySize * keyboardLeft}px, +${keySize * keyboardTop}px, 0)`,
          width: `${keySize * keyboardWidth}px`
        }"
      >
        <div
          v-for="{ code, key } in keyboard"
          :key="code"
          :class="[ `key-${code}` ]"
          :style="{ width: `${keySize}px`, height: `${keySize}px`}"
        >
          <span>{{ key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-canvas {
  position: relative;

  margin-top: 60px;
  margin-bottom: 40px;
}

.display-grid {
  position: relative;

  left: 50%;
  transform: translateX(-50%);

  border-width: 1px;
  border-style: solid;
  border-top: 0;
  border-left: 0;

  .dark & {
    background-image: linear-gradient(to right, #555 1px, transparent 1px), linear-gradient(to bottom, #555 1px, transparent 1px);
    border-color: #555;
  }

  .paper & {
    background-image: linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px);
    border-color: #ddd;
  }

  .hide & {
    border-width: 0;
    background: transparent;
  }

  .active-key {
    position: absolute;
    z-index: -1;
  }
}

.keyboard {
  position: absolute;
  display: inline-block;
  top: 0;

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .paper & {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

[class*='key-'] {
  display: inline-block;
  vertical-align: top;
  border-width: 1px;
  border-style: solid;
  border-bottom-width: 0;
  border-right-width: 0;
  opacity: 1 !important;

  padding: 5px;
  margin: 0;

  span {
    font-size: 1vw;
    display: inline;
    color: #555;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dark & {
    border-color: #555;
  }
  .paper & {
    border-color: #ddd;
  }
  .hide & {
    border-width: 0px;
  }
}
</style>

<script>
import Vue from 'vue'

import LZString from 'lz-string'

import { mapGetters, mapActions, mapState } from 'vuex'
import { findIndex as _findIndex } from 'lodash'

import keyboard from '../data/keyboard'

export default {
  props: [
    'inactive',
  ],
  data: () => ({
    grid: [],
    gridSize: [3, 4],

    keySize: 30,
    keyboardWidth: 9,

    keyboard,
    keyboardPosition: [0, 0],

    properties: {
      shown: true,
    },
  }),
  computed: {
    ...mapGetters('color', ['currentHex']),
    ...mapGetters('theme', ['currentTheme', 'exportTheme']),
    ...mapGetters('grid', ['exportActives']),

    ...mapState('grid', ['actives']),

    keyboardHeight() {
      return ~~( this.keyboard.length / this.keyboardWidth )
    },

    gridWidth() {
      return this.keyboardWidth * this.gridSize[0]
    },
    gridHeight() {
      return this.keyboardHeight * this.gridSize[1]
    },

    keyboardLeft() {
      return this.keyboardPosition[0]
    },
    keyboardTop() {
      return this.keyboardPosition[1]
    },
  },
  methods: {
    ...mapActions('color', ['nextColor']),
    ...mapActions('theme', ['nextTheme']),
    ...mapActions('grid', ['clearActives', 'toggleActive']),

    toggleGrid(keyboardIndex) {
      const gridLeft = this.keyboardLeft + keyboardIndex % this.keyboardWidth
      const gridTop = this.keyboardTop + ~~(keyboardIndex / this.keyboardWidth)

      this.toggleActive({
        position: `${gridLeft}x${gridTop}`,
        color: this.currentHex
      })
    },

    keyOperation(evt) {
      if (!this.inactive) {
        evt.preventDefault()

        switch (evt.key) {
          case 'ArrowLeft': {
            // LEFT ARROW
            if (this.properties.shown && this.keyboardLeft > 0) {
              Vue.set(this.keyboardPosition, 0, this.keyboardLeft - this.keyboardWidth)
            }
            break
          }
          case 'ArrowUp': {
            // UP ARROW
            if (this.properties.shown && this.keyboardTop > 0) {
              Vue.set(this.keyboardPosition, 1, this.keyboardTop - this.keyboardHeight)
            }
            break
          }
          case 'ArrowRight': {
            // RIGHT ARROW
            if (this.properties.shown && this.keyboardLeft < this.gridWidth - this.keyboardWidth) {
              Vue.set(this.keyboardPosition, 0, this.keyboardLeft + this.keyboardWidth)
            }
            break
          }
          case 'ArrowDown': {
            // DOWN ARROW
            if (this.properties.shown && this.keyboardTop < this.gridHeight - this.keyboardHeight) {
              Vue.set(this.keyboardPosition, 1, this.keyboardTop + this.keyboardHeight)
            }
            break
          }
          case 'Control': {
            // CTRL
            this.properties.shown = !this.properties.shown
            break
          }
          case ' ': {
            // SPACE
            this.clearActives()
            break
          }
          case 'Shift': {
            // SHIFT
            this.nextColor()
            break
          }
          case 'Alt': {
            // ALT
            this.nextTheme()
            break
          }
          case 'Enter': {
            // ENTER
            const exportString = `${this.exportTheme};${this.exportActives}`
            const routeParam = LZString.compressToEncodedURIComponent(exportString)

            this.$router.push(`/artefact/${routeParam}`)
            break
          }
          default: {
            // KEYS
            if (this.properties.shown) {
              const keyboardIndex = _findIndex(keyboard, ['key', evt.key])

              if (keyboardIndex > -1) {
                this.toggleGrid(keyboardIndex)
              }
            }
          }
        }
      }
    },
  },
  beforeMount() {
    window.addEventListener('keydown', this.keyOperation)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)
  },
}
</script>
