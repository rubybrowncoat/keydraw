<template>
  <div>
    <nuxt />
    <keytsh />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
}

html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
</style>

<script>
import Keytsh from '../components/Keytsh/Keytsh.vue'

export default {
  name: 'KeyDraw',
  components: {
    keytsh: Keytsh,
  }
}
</script>
