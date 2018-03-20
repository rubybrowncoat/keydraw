<template>
  <div class="action-bar" :class="{
    hide: inactive,
  }">

    <div class="menu active" v-show="!inactive">

      <span class="menuItem"><span class="label">&#11152;</span><em>ARTEFACT</em></span>
      <span class="menuItem"><span class="label">&#92;</span><em>COMMUNE</em></span>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.action-bar {
  position: fixed;
  width: 280px;
  padding: 20px 10px;
  bottom: 0px;
  left: 50%;
  margin-left: -140px;
  //transform: translateX(-50%);
  vertical-align: middle;
  text-transform: uppercase;
  font-size: 22px;
  border-radius: 10px 10px 0 0;
  border-width: 1px;
  border-style: solid;
 

  .menu {
    .menuItem {
      display: inline-block;
      margin-bottom: 0px;
      margin-left: 15px;
      white-space: nowrap;
      .label {
        font-size: 15px;
        border-width: 1px;
        border-style: solid;
        padding: 5px 8px;
        margin-right: 10px;
        border-radius: 5px;
      }
    }
  }


}

</style>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [
    'inactive',
  ],

}
</script>
