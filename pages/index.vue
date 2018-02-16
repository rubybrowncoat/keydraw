<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <instructions />
      <base-canvas />
    </div>
  </div>
</template>

<script>
import Instructions from '../components/Instructions'
import BaseCanvas from '../components/BaseCanvas'
import { mapGetters, mapActions } from 'vuex'

export default {
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    } else if (from.name === 'artefact-magic') {
      return 'slide-right'
    }
  },
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
  },
  computed: {
    ...mapGetters('theme', ['currentTheme']),
  },
}
</script>
