<template>
  <div>
    <base-canvas />
    <instructions />
  </div>
</template>

<script>
import Instructions from '../components/Instructions'
import BaseCanvas from '../components/BaseCanvas'

export default {
  components: {
    instructions: Instructions,
    'base-canvas': BaseCanvas,
  },
}
</script>
