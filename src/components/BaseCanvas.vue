<template>
  <div class="base-canvas" :class="{
    hide: !properties.shown,
  }">
    <div class="grid" v-if="false">
      <template v-for="i in gridHeight">
        <div
          v-for="j in gridWidth"
          :key="((i-1)*gridWidth)+(j-1)"
          :class="[ 'key-piece', `${((i-1)*gridWidth)+(j-1)}` ]"
          :style="{
            backgroundColor: grid[i-1][j-1] || 'transparent',
            width: `${keySize}vw`,
            height: `${keySize}vw`
          }"
        />
      </template>
    </div>
    <div
      class="display-grid"
      :style="{
        width: `${gridWidth * keySize}px`,
        height: `${gridHeight * keySize}px`,
      }"
    >
      <div
        v-for="(active, key) in actives"
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
        v-show="properties.shown"
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
  background-size: 20px 20px;

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

import { mapGetters, mapActions } from 'vuex'

import keyboard from '../data/keyboard'

import { findIndex as _findIndex } from 'lodash'

export default {
  data: () => ({
    grid: [],
    gridSize: [3, 4],

    keySize: 20,
    keyboardWidth: 9,

    keyboard,
    keyboardPosition: [0, 0],

    properties: {
      shown: true,
    },
  }),
  computed: {
    ...mapGetters('color', ['currentHex']),
    ...mapGetters('theme', ['currentTheme']),
    ...mapGetters('grid', ['actives']),

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
      evt.preventDefault()

      switch (evt.key) {
        case 'ArrowLeft': {
          // LEFT ARROW
          if (this.keyboardLeft > 0) {
            Vue.set(this.keyboardPosition, 0, this.keyboardLeft - this.keyboardWidth)
          }
          break
        }
        case 'ArrowUp': {
          // UP ARROW
          if (this.keyboardTop > 0) {
            Vue.set(this.keyboardPosition, 1, this.keyboardTop - this.keyboardHeight)
          }
          break
        }
        case 'ArrowRight': {
          // RIGHT ARROW
          if (this.keyboardLeft < this.gridWidth - this.keyboardWidth) {
            Vue.set(this.keyboardPosition, 0, this.keyboardLeft + this.keyboardWidth)
          }
          break
        }
        case 'ArrowDown': {
          // DOWN ARROW
          if (this.keyboardTop < this.gridHeight - this.keyboardHeight) {
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
        default: {
          const keyboardIndex = _findIndex(keyboard, ['key', evt.key])

          if (keyboardIndex > -1) {
            this.toggleGrid(keyboardIndex)
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
