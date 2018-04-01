<template>
  <div class="action-bar">
    <div
      v-if="kind === 'keydraw'"
      class="menu active">
      <span class="menuItem">
        <span class="label">&#11152;</span>
        <em> ARTEFACT </em>
      </span>
      <span class="menuItem">
        <span class="label">&#92;</span>
        <em> COMMUNE </em>
      </span>
    </div>

    <div
      v-if="kind === 'artefact'"
      class="menu active">
      <span class="menuItem">
        <span class="label">&#9003;</span>
        EDIT
      </span>
    </div>

    <div
      v-if="kind === 'commune'"
      class="menu active">
      <span class="menuItem">
        <span class="label">&#9003;</span>
        GO ALONE
      </span>
    </div>

    <div
      v-if="kind === 'generic'"
      class="menu active">
      <span class="menuItem">
        <span class="label">&#9003;</span>
        BACK
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-bar {
  position: fixed;
  padding: 20px 20px;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  text-align: center;
  text-transform: uppercase;
  font-size: 22px;
  border-radius: 10px 10px 0 0;
  border-width: 1px;
  border-bottom-width: 0;
  border-style: solid;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    kind: {
      type: String,

      default: 'keydraw',
    },
  },

}
</script>
