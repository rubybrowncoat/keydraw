<template>
  <div id="wrapper" :class="currentTheme">
    <instructions :inactive="true" />
    <base-canvas :inactive="true" />
  </div>
</template>

<style lang="scss" scoped>
#wrapper {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100vh;

  &.dark {
    color: #ffffff;
    background-color: #444444;
    font-family: 'VT323';
    & a {
      color: #fff;
      text-decoration: none;
    }
  }

  &.paper {
    color: #000000;
    background-color: #fffced;
    font-family: 'Amiri';
    & a {
      color: #000;
      text-decoration: none;
    }
  }
}
</style>


<script>
import { mapGetters, mapActions } from 'vuex'

import LZString from 'lz-string'

import Instructions from '../components/Instructions'
import BaseCanvas from '../components/BaseCanvas'

export default {
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
