<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions :inactive="true" />
      <base-canvas
        :keySize="keySize"

        :hidden="true"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import LZString from 'lz-string'

import Instructions from '../../components/Instructions'
import BaseCanvas from '../../components/BaseCanvas'

export default {
  transition: 'slide-left',
  data: () => ({
    keySize: 30,

    hidden: false,

    board: {},
  }),
  components: {
    'instructions': Instructions,
    'base-canvas': BaseCanvas,
  },
  computed: {
    ...mapGetters('theme', ['currentTheme']),
  },
  methods: {
    ...mapActions('theme', ['setTheme']),
    ...mapActions('grid', ['setSize', 'setActives']),

    keyOperation(evt) {
      evt.preventDefault()

      switch (evt.key) {
        case 'Backspace': {
          // LEFT ARROW
          this.$router.push('/')
          break
        }
      }
    },
  },
  async asyncData({ params: { magic }, app }) {
    const board = await app.$axios.$get(`saved_boards/${magic}`)

    return { board }
  },
  beforeMount() {
    window.addEventListener('keydown', this.keyOperation)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)
  },
  mounted() {
    const { board } = this

    if (board.content) {
      const exportString = LZString.decompressFromEncodedURIComponent(board.content)
      const [ themeExport, sizeExport, activesExport ] = exportString.split(';')

      const [ , theme ] = themeExport.split('#')
      const [ , size ] = sizeExport.split('#')
      const [ , actives ] = activesExport.split('#')

      this.setTheme(theme)
      this.setSize(size)
      this.setActives(actives)
    }
  },
}
</script>
