<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions />
      <base-canvas
        :keySize="keySize"

        :keyboardLeft="keyboardLeft"
        :keyboardTop="keyboardTop"

        :hidden="hidden"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import LZString from 'lz-string'

import { mapGetters, mapActions } from 'vuex'

import { findIndex as _findIndex } from 'lodash'

import Instructions from '../components/Instructions'
import BaseCanvas from '../components/BaseCanvas'

import keyboard from '../data/keyboard'

export default {
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    } else if (from.name === 'artefact-magic') {
      return 'slide-right'
    }
  },
  data: () => ({
    keySize: 30,
    keyboardPosition: [0, 0],

    hidden: false,
  }),
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
  },
  computed: {
    ...mapGetters('color', ['currentHex']),
    ...mapGetters('theme', [
      'currentTheme',

      'exportTheme',
    ]),
    ...mapGetters('grid', [
      'gridWidth',
      'gridHeight',

      'keyboardWidth',
      'keyboardHeight',

      'exportSize',
      'exportActives',
    ]),

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
    ...mapActions('grid', [
      'incrementWidth',
      'decrementWidth',
      'incrementHeight',
      'decrementHeight',

      'clearActives',
      'toggleActive'
    ]),

    toggleGrid(keyboardIndex) {
      const gridLeft = this.keyboardLeft + keyboardIndex % this.keyboardWidth
      const gridTop = this.keyboardTop + ~~(keyboardIndex / this.keyboardWidth)

      this.toggleActive({
        position: `${gridLeft}x${gridTop}`,
        color: this.currentHex
      })
    },

    checkKeyboard() {
      if (this.keyboardLeft >= this.gridWidth) {
        Vue.set(this.keyboardPosition, 0, this.gridWidth - this.keyboardWidth)
      }

      if (this.keyboardTop >= this.gridHeight) {
        Vue.set(this.keyboardPosition, 1, this.gridHeight - this.keyboardHeight)
      }
    },

    keyOperation(evt) {
      evt.preventDefault()

      switch (evt.key) {
        case 'ArrowLeft': {
          // LEFT ARROW
          if (!this.hidden) {
            if (evt.shiftKey) {
              this.decrementWidth()

              this.$nextTick(() => {
                this.checkKeyboard()
              })
            } else {
              if (this.keyboardLeft > 0) {
                Vue.set(this.keyboardPosition, 0, this.keyboardLeft - this.keyboardWidth)
              }
            }
          }
          break
        }
        case 'ArrowUp': {
          // UP ARROW
          if (!this.hidden) {
            if (evt.shiftKey) {
              this.decrementHeight()

              this.$nextTick(() => {
                this.checkKeyboard()
              })
            } else {
              if (this.keyboardTop > 0) {
                Vue.set(this.keyboardPosition, 1, this.keyboardTop - this.keyboardHeight)
              }
            }
          }
          break
        }
        case 'ArrowRight': {
          // RIGHT ARROW
          if (!this.hidden) {
            if (evt.shiftKey) {
              this.incrementWidth()
            } else {
              if (this.keyboardLeft < this.gridWidth - this.keyboardWidth) {
                Vue.set(this.keyboardPosition, 0, this.keyboardLeft + this.keyboardWidth)
              }
            }
          }
          break
        }
        case 'ArrowDown': {
          // DOWN ARROW
          if (!this.hidden) {
            if (evt.shiftKey) {
              this.incrementHeight()
            } else {
              if (this.keyboardTop < this.gridHeight - this.keyboardHeight) {
                Vue.set(this.keyboardPosition, 1, this.keyboardTop + this.keyboardHeight)
              }
            }
          }
          break
        }
        case 'p': {
          // p
          this.hidden = !this.hidden
          break
        }
        case 'Backspace': {
          // BACKSPACE
          this.clearActives()
          break
        }
        case ' ': {
          // SPACE
          this.nextColor()
          break
        }
        case 'o': {
          // o
          this.nextTheme()
          break
        }
        case 'Enter': {
          // ENTER
          const exportString = `${this.exportTheme};${this.exportSize};${this.exportActives}`
          const routeParam = LZString.compressToEncodedURIComponent(exportString)

          this.$router.push(`/artefact/${routeParam}`)
          break
        }
        default: {
          // KEYS
          if (!this.hidden) {
            const keyboardIndex = _findIndex(keyboard, ['key', evt.key])

            if (keyboardIndex > -1) {
              this.toggleGrid(keyboardIndex)
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
