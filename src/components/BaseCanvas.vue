<template>
  <div id="base-canvas" :class="[ 'canvas-element', properties.shown ? '' : 'hide' ]">
    <div class="grid">
      <template v-for="i in gridHeight">
        <div v-for="j in size" :key="((i-1)*30)+(j-1)" :class="[ 'key-piece', `${((i-1)*30)+(j-1)}`, grid[i-1][j-1] ]" />
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
  border: 1px solid #5050C6;
  border-top-width: 0;
  border-left-width: 0;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  .hide & {
    border-width: 0;
  }
}

.keyboard {
  position: absolute;
  display: inline-block;

  width: calc(2.2vw * 10);
  top: 0;

  background-color: rgba(65, 65, 165, 0.5);
  opacity: 1;
  transition: opacity 0s ease-in;
}

[class*='key-'] {
  display: inline-block;
  vertical-align: top;

  opacity: 1 !important;

  border: 1px solid #5050C6;
  border-right-width: 0;
  border-bottom-width: 0;

  width: 2.2vw;
  height: 2.2vw;
  padding: 5px;

  span {
    font-size: 1vw;
    display: inline;
    color: #5050C6;
    margin: 0 !important;
    padding: 0 !important;
  }

  &.white { background-color: #fff; }
  &.black { background-color: #000; }
  &.red { background-color: #f00; }
  &.blue { background-color: #00f; }
  &.green { background-color: #0f0; }
  &.yellow { background-color: #ff0; }

  .hide & {
    border-width: 0px;
  }
}
</style>

<script>
import Vue from 'vue'
import keyboard from '../data/keyboard'

import { findIndex as _findIndex } from 'lodash'

export default {
  data: () => ({
    size: 30,
    grid: [],

    colors: ['white', 'black', 'red', 'blue', 'green', 'yellow'],

    currentColorIndex: 0,
    currentColor: 'white',

    gridHeight: 20,

    keyboard,
    keyboardWidth: 10,
    keyboardPosition: [0, 0],

    properties: {
      shown: true,
    },
  }),
  computed: {
    keyboardLeft() {
      return this.keyboardPosition[0]
    },
    keyboardTop() {
      return this.keyboardPosition[1]
    }
  },
  methods: {
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
      
      if (!newRow[gridLeft]) { newRow[gridLeft] = this.currentColor }
        else if (newRow[gridLeft] != this.currentColor) { newRow[gridLeft] = this.currentColor } else {newRow[gridLeft] = false}

          Vue.set(this.grid, gridTop, newRow)
        console.log(newRow)
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
          if (this.currentColorIndex < this.colors.length - 1) {
            this.currentColorIndex++;
          } else { this.currentColorIndex = 0 }
          this.currentColor = this.colors[this.currentColorIndex]

          console.log(this.currentColor)

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
