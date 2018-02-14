<template>
  <div
    id="base-canvas"
    :class="[ 'canvas-element', properties.shown ? '' : 'hide' ]"
    :style="{
      width: `calc(${keySize * gridWidth}vw + 1px)`,
      height: `calc(${keySize * gridHeight}vw + 1px)`,
    }"
  >
    <div class="grid">
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
      class="keyboard"
      v-show="properties.shown"
      :style="{
        transform: `translate3d(+${keySize * keyboardLeft}vw, +${keySize * keyboardTop}vw, 0)`,
        width: `${keySize * keyboardWidth}vw`
      }"
    >
      <div
        v-for="{ code, key } in keyboard"
        :key="code"
        :class="[ `key-${code}` ]"
        :style="{ width: `${keySize}vw`, height: `${keySize}vw`}"
      >
        <span>{{ key }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.canvas-element {
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  margin-top: 80px;
  margin-bottom: 40px;
}

.grid {
  border-width: 1px;
  border-style: solid;
  border-top-width: 0;
  border-left-width: 0;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  .dark & {
    border-color: #555;
  }
  .paper & {
    border-color: #ddd;
  }
  .hide & {
    border-width: 0;
  }
}

.keyboard {
  position: absolute;
  display: inline-block;
  top: 0;
  opacity: 1;

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }
  .paper & {
    background-color: rgba(0, 0, 0, 0.05);
  }

  & [class*='key-'] {
    border-width: 0px;
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
    gridSize: [4, 8],

    keySize: 2.5,
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

    initGrid() {
      let grid = []

      for (var idx = 0; idx < this.gridHeight; idx += 1) {
        grid[idx] = new Array(this.gridWidth)
      }

      this.grid = grid
    },
    toggleGrid(keyboardIndex) {
      const gridLeft = this.keyboardLeft + keyboardIndex % this.keyboardWidth
      const gridTop = this.keyboardTop + ~~(keyboardIndex / this.keyboardWidth)

      const newRow = this.grid[gridTop]

      if (!newRow[gridLeft]) {
        newRow[gridLeft] = this.currentHex
      } else if (newRow[gridLeft] != this.currentHex) {
        newRow[gridLeft] = this.currentHex
      } else {
        newRow[gridLeft] = false
      }

      Vue.set(this.grid, gridTop, newRow)
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
          this.initGrid()
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
    this.initGrid()

    window.addEventListener('keydown', this.keyOperation)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)
  },
}
</script>
