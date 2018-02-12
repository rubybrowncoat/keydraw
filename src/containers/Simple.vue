<template>
  <div id="wrapper" :class="currentTheme">
    <base-canvas />
    <instructions />
  </div>
</template>

<script>
import Instructions from '../components/Instructions'
import BaseCanvas from '../components/BaseCanvas'
import { mapGetters, mapActions } from 'vuex'


export default {
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
  },
   computed: {
    ...mapGetters('theme', ['currentTheme']),
	}
}
</script>
