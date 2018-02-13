<template>
  <div id="base-canvas" :class="[ 'canvas-element', properties.shown ? '' : 'hide' ]">
    <div class="grid">
      <template v-for="i in gridHeight">
        <div v-for="j in size" :key="((i-1)*30)+(j-1)" :class="[ 'key-piece', `${((i-1)*30)+(j-1)}` ]" :style="{ backgroundColor: grid[i-1][j-1] || 'transparent' }" />
      </template>
    </div>
    <div class="keyboard" v-show="properties.shown" :style="{
      transform: `translate3d(+${2.2 * keyboardLeft}vw, +${2.2 * keyboardTop}vw, 0)`,
    }">
    <div v-for="{ code, key } in keyboard" :key="code" :class="[ `key-${code}` ]">
      <span>{{ key }}</span>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.canvas-element {
  position: relative;

  width: calc(66vw + 1px);

  top: 40px;
  left: 50%;

  transform: translateX(-50%);
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
  width: calc(2.2vw * 10);
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

  width: 2.2vw;
  height: 2.2vw;
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
    size: 30,
    grid: [],

    gridHeight: 20,

    keyboard,
    keyboardWidth: 10,
    keyboardPosition: [0, 0],

    properties: {
      shown: true,
    },
  }),
  computed: {
    ...mapGetters('color', ['currentHex']),
    ...mapGetters('theme', ['currentTheme']),

    keyboardLeft() {
      return this.keyboardPosition[0]
    },
    keyboardTop() {
      return this.keyboardPosition[1]
    }
  },
  methods: {
    ...mapActions('color', ['nextColor']),
    ...mapActions('theme', ['nextTheme']),

    initGrid() {
      let grid = []

      for (var idx = 0; idx < this.size; idx += 1) {
        grid[idx] = new Array(this.size);
      }

      this.grid = grid
    },
    toggleGrid(keyboardIndex) {
      const gridLeft = this.keyboardLeft + ( keyboardIndex % this.keyboardWidth )
      const gridTop = this.keyboardTop + ~~( keyboardIndex / this.keyboardWidth )

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

      const keyboardHeight = ~~( this.keyboard.length / this.keyboardWidth )

      switch (evt.key) {
        case 'ArrowLeft': { // LEFT ARROW
          if (this.keyboardLeft > 0) {
            Vue.set(this.keyboardPosition, 0, this.keyboardLeft - this.keyboardWidth)
          }
          break
        }
        case 'ArrowUp': { // UP ARROW
          if (this.keyboardTop > 0) {
            Vue.set(this.keyboardPosition, 1, this.keyboardTop - keyboardHeight)
          }
          break
        }
        case 'ArrowRight': { // RIGHT ARROW
          if (this.keyboardLeft < this.size - this.keyboardWidth) {
            Vue.set(this.keyboardPosition, 0, this.keyboardLeft + this.keyboardWidth)
          }
          break
        }
        case 'ArrowDown': { // DOWN ARROW
          if (this.keyboardTop < this.gridHeight - keyboardHeight) {
            Vue.set(this.keyboardPosition, 1, this.keyboardTop + keyboardHeight)
          }
          break
        }
        case 'Control': { // CTRL
          this.properties.shown = !this.properties.shown
          break
        }
        case ' ': { // SPACE
          this.initGrid()
          break
        }
        case 'Shift': { // SHIFT
          this.nextColor()
          break
        }
        case 'Alt': { // ALT
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
  }
}

</script>
