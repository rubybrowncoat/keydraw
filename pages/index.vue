<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions />
      <base-canvas
        ref="base"
        :keySize="keySize"

        :keyboardLeft="keyboardLeft"
        :keyboardTop="keyboardTop"

        :hidden="hidden"
      />
      <canvas ref="map" class="map-canvas" v-show="isMapActive" />
      <action-bar />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import { mapGetters, mapActions } from 'vuex'

import {
  find as _find,
  findIndex as _findIndex,
  memoize as _memoize,
  reduce as _reduce,
} from 'lodash-es'

import Instructions from '~/components/Instructions'
import BaseCanvas from '~/components/BaseCanvas'
import ActionBar from '~/components/ActionBar'

import Tilesettolo from '~/libs/tileset'
import Observanto from '~/libs/observer'

import keyboard from '~/data/keyboard'
import colors from '~/data/colors'

export default {
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    } else {
      return 'slide-right'
    }
  },
  data: () => ({
    keySize: 30,
    keyboardPosition: [0, 0],

    hidden: false,

    generator: null,
    isMapActive: false,

    isMapRunning: true,
    mapRunner: null,
  }),
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
    'action-bar': ActionBar,
  },
  computed: {
    ...mapGetters('color', ['currentName']),
    ...mapGetters('theme', ['currentTheme', 'exportTheme']),
    ...mapGetters('grid', [
      'actives',

      'gridWidth',
      'gridHeight',

      'keyboardWidth',
      'keyboardHeight',

      'exportSize',
      'exportActives',
      'exportBuffer',
    ]),
    ...mapGetters('keytsh', ['keytshCollapsed']),
    ...mapGetters('map', ['tileSize', 'mapWidth', 'mapHeight']),

    keyboardLeft() {
      return this.keyboardPosition[0]
    },
    keyboardTop() {
      return this.keyboardPosition[1]
    },
  },
  methods: {
    ...mapActions('color', ['nextColor', 'previousColor']),
    ...mapActions('theme', ['nextTheme', 'previousTheme']),
    ...mapActions('grid', [
      'incrementWidth',
      'decrementWidth',
      'incrementHeight',
      'decrementHeight',

      'clearActives',
      'toggleActive',
    ]),
    ...mapActions('keytsh', ['toggleKeytshCollapse']),
    ...mapActions('map', ['increaseTileSize', 'decreaseTileSize']),

    toggleGrid(keyboardIndex) {
      const gridLeft = this.keyboardLeft + keyboardIndex % this.keyboardWidth
      const gridTop = this.keyboardTop + ~~(keyboardIndex / this.keyboardWidth)

      this.toggleActive({
        position: `${gridLeft}x${gridTop}`,
        name: this.currentName,
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

    async doExport() {
      const content = `${this.exportTheme};${this.exportSize};${this.exportActives}`

      const board = await this.$axios.$post('saved_boards', {
        content,
      })

      if (board.url) {
        this.$router.push(`/artefact/${board.url}`)
      }
    },

    async doShared() {
      const content = `${this.exportTheme};${this.exportSize}`

      const board = await this.$axios.$post('shared_boards', {
        content,
      })

      if (board.url) {
        this.$router.push(`/commune/${board.url}`)
      }
    },

    keyOperation(evt) {
      if (this.keytshCollapsed) {
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
            /*if (evt.shiftKey) {
                this.previousColor()
              } else {*/
            this.nextColor()
            break
            //}
          }
          case 'o': {
            // o
            this.nextTheme()
            break
          }
          case 'i': {
            // i
            this.previousTheme()
            break
          }
          case 'Enter': {
            // ENTER
            this.doExport()
            break
          }
          case '\\': {
            // Backslash
            this.doShared()
            break
          }
          case '=': {
            const occupancy = this.tileSize + 1

            const tileSet = new Tilesettolo(
              this.exportBuffer,
              this.tileSize,
              this.mapWidth,
              this.mapHeight
            )
            const generator = new Observanto(this.gridWidth, this.gridHeight, tileSet)

            const tiledWidth = this.gridWidth * this.tileSize
            const tiledHeight = this.gridHeight * this.tileSize

            const grid = this.$refs.base.$refs.grid
            const map = this.$refs.map
            const context = map.getContext('2d')

            map.width = tiledWidth
            map.height = tiledHeight

            context.fillStyle = map.style.backgroundColor
            // context.fillRect(0, 0, tiledWidth, tiledHeight)

            context.imageSmoothingEnabled = false
            context.webkitImageSmoothingEnabled = false
            context.mozImageSmoothingEnabled = false

            map.style.width = grid.style.width
            map.style.height = grid.style.height

            let computingStep = false
            let contradiction = false
            let contraditionCounter = 0
            let generationData = context.createImageData(
              generator.width * generator.tilesize,
              generator.height * generator.tilesize
            )

            this.isMapActive = true
            this.isMapRunning = true

            this.mapRunner = () => {
              if (computingStep) {
                if (contradiction) {
                  console.log('!!CONTRADICTION!!')

                  contraditionCounter += 1

                  if (contraditionCounter > 10) {
                    this.mapRunner = null

                    return
                  }

                  generator.clear()
                }

                contradiction = !generator.iterate(2)
              } else {
                generator.graphics(generationData.data, null)
                context.putImageData(generationData, 0, 0)

                if (generator.isComplete()) {
                  this.isMapRunning = false
                }
              }

              computingStep = !computingStep
            }

            break
          }
          case '-': {
            this.isMapActive = false
            this.isMapRunning = false

            break
          }
          case '[': {
            this.decreaseTileSize()

            break
          }
          case ']': {
            this.increaseTileSize()

            break
          }
          // case '€': {
          //   // Euro Symbol
          //   this.$router.push('/keycler')
          //   break
          // }
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
      }

      switch (evt.key) {
        case '!': {
          this.toggleKeytshCollapse()
          break
        }
      }
    },
  },
  created() {
    const mapGenerator = () => {
      if (this.isMapRunning && typeof this.mapRunner === 'function') {
        this.mapRunner()
      }

      requestAnimationFrame(mapGenerator)
    }

    mapGenerator()
  },
  beforeMount() {
    window.addEventListener('keydown', this.keyOperation)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)
  },
}
</script>
