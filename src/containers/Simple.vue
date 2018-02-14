<template>
  <div id="wrapper" :class="currentTheme">
    <instructions />
    <base-canvas />
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
  },
}
</script>
