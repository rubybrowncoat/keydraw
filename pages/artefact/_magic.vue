<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions :inactive="true" />
      <base-canvas :inactive="true" />
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
  components: {
    'instructions': Instructions,
    'base-canvas': BaseCanvas,
  },
  computed: {
    ...mapGetters('theme', ['currentTheme']),
  },
  methods: {
    ...mapActions('theme', ['setTheme']),
    ...mapActions('grid', ['setActives']),

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
  beforeMount() {
    window.addEventListener('keydown', this.keyOperation)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyOperation)
  },
  created() {
    const { magic } = this.$route.params
    const exportString = LZString.decompressFromEncodedURIComponent(magic)
    const [ themeExport, activesExport ] = exportString.split(';')

    const [ , theme ] = themeExport.split('#')
    const [ , actives ] = activesExport.split('#')

    this.setTheme(theme)
    this.setActives(actives)
  },
}
</script>
