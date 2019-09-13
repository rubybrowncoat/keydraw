<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions :artefact="true" />
      <base-canvas
        :keySize="keySize"

        :hidden="true"
      />
      <action-bar kind="artefact" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Instructions from '../../components/Instructions'
import BaseCanvas from '../../components/BaseCanvas'
import ActionBar from '../../components/ActionBar'

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
    'action-bar': ActionBar,
  },
  computed: {
    ...mapGetters('theme', ['currentTheme']),
    ...mapGetters('keytsh', ['keytshCollapsed']),
  },
  methods: {
    ...mapActions('theme', ['setTheme']),
    ...mapActions('grid', ['setSize', 'setActives']),
    ...mapActions('keytsh', ['toggleKeytshCollapse']),

    keyOperation(evt) {
      if (this.keytshCollapsed) {
        evt.preventDefault()

        switch (evt.key) {
          case 'Backspace': {
            // LEFT ARROW
            this.$router.push('/')

            break
          }

          case '@': {
            try {
              this.$copyText(window.location.href).then(() => {
                alert('Artefact URL copied to clipboard.')
              })
            } catch (e) {
              console.error(e)
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
      const [ themeExport, sizeExport, activesExport ] = board.content.split(';')

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
