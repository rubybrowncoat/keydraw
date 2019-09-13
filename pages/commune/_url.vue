<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions :commune="true" />
      <base-canvas
        :keySize="keySize"

        :keyboardLeft="keyboardLeft"
        :keyboardTop="keyboardTop"

        :hidden="hidden"
      />
      <action-bar kind="commune" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import ActionCable from 'actioncable'

import { findIndex as _findIndex } from 'lodash-es'

import Instructions from '../../components/Instructions'
import BaseCanvas from '../../components/BaseCanvas'
import ActionBar from '../../components/ActionBar'

import keyboard from '../../data/keyboard'
import colors from '../../data/colors'

export default {
  transition: 'slide-left',
  data: () => ({
    keySize: 30,
    keyboardPosition: [0, 0],

    hidden: false,

    board: {},

    cable: null,
    subscription: null,
  }),
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
    'action-bar': ActionBar,
  },
  computed: {
    ...mapGetters('color', ['currentName']),
    ...mapGetters('theme', ['currentTheme']),
    ...mapGetters('grid', [
      'gridWidth',
      'gridHeight',

      'keyboardWidth',
      'keyboardHeight',
    ]),

    keyboardLeft() {
      return this.keyboardPosition[0]
    },
    keyboardTop() {
      return this.keyboardPosition[1]
    },
  },
  methods: {
    ...mapActions('color', ['nextColor', 'previousColor']),
    ...mapActions('theme', ['setTheme']),
    ...mapActions('grid', [
      'setSize',
      'setCommuneActives',

      'setShared',
      'toggleShared',
    ]),

    async toggleGrid(keyboardIndex) {
      const left = this.keyboardLeft + keyboardIndex % this.keyboardWidth
      const top = this.keyboardTop + ~~(keyboardIndex / this.keyboardWidth)

      const { url } = this.$route.params

      this.toggleShared({
        left,
        top,

        url,

        name: this.currentName,
      })
    },

    keyOperation(evt) {
      evt.preventDefault()

      switch (evt.key) {
        case 'ArrowLeft': {
          // LEFT ARROW
          if (!this.hidden) {
            if (this.keyboardLeft > 0) {
              Vue.set(this.keyboardPosition, 0, this.keyboardLeft - this.keyboardWidth)
            }
          }
          break
        }
        case 'ArrowUp': {
          // UP ARROW
          if (!this.hidden) {
            if (this.keyboardTop > 0) {
              Vue.set(this.keyboardPosition, 1, this.keyboardTop - this.keyboardHeight)
            }
          }
          break
        }
        case 'ArrowRight': {
          // RIGHT ARROW
          if (!this.hidden) {
            if (this.keyboardLeft < this.gridWidth - this.keyboardWidth) {
              Vue.set(this.keyboardPosition, 0, this.keyboardLeft + this.keyboardWidth)
            }
          }
          break
        }
        case 'ArrowDown': {
          // DOWN ARROW
          if (!this.hidden) {
            if (this.keyboardTop < this.gridHeight - this.keyboardHeight) {
              Vue.set(this.keyboardPosition, 1, this.keyboardTop + this.keyboardHeight)
            }
          }
          break
        }
        case 'p': {
          // p
          this.hidden = !this.hidden
          break
        }
        case ' ': {
          // SPACE
          this.nextColor()
          break
        }
        case 'Backspace': {
          // LEFT ARROW
          this.$router.push('/')
          break
        }
        case '@': {
          try {
            this.$copyText(window.location.href).then(() => {
              alert('Commune URL copied to clipboard.')
            })
          } catch (e) {
            console.error(e)
          }
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
  async asyncData({ params: { url }, app }) {
    const board = await app.$axios.$get(`shared_boards/${url}`)

    return { board }
  },
  beforeMount() {
    window.addEventListener('keydown', this.keyOperation)

    if (!this.cable) {
      this.cable = ActionCable.createConsumer(process.env.WS_URL)

      this.subscription = this.cable.subscriptions.create('SharedActivesChannel', {
        received: (data) => {
          const { active, board } = data

          if (board === this.$route.params.url) {
            this.setShared({
              position: `${active.left}x${active.top}`,
              status: active.status,
            })
          }
        },
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)

    if (this.subscription) {
      this.subscription.unsubscribe()

      this.subscription = null
    }

    if (this.cable) {
      this.cable = null
    }
  },
  mounted() {
    const { board } = this

    if (board.content) {
      const [themeExport, sizeExport] = board.content.split(';')

      const [, theme] = themeExport.split('#')
      const [, size] = sizeExport.split('#')

      this.setTheme(theme)
      this.setSize(size)

      this.setCommuneActives(board.actives)
    }
  },
}
</script>
