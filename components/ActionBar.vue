<template>
  <div class="action-bar">

    <div class="menu active" v-show="!artefact && !commune">
      <span class="menuItem"><span class="label">&#11152;</span><em>ARTEFACT</em></span>
      <span class="menuItem"><span class="label">&#92;</span><em>COMMUNE</em></span>
    </div>
    <div class="menu active" v-show="artefact">
      <span class="menuItem"><span class="label">&#9003;</span>EDIT</span>
    </div>
    <div class="menu active" v-show="commune">
      You are now in a <em>commune</em>. Share it with your friends and enemies!
    </div>

  </div>
</template>

<style lang="scss" scoped>
.action-bar {
  position: fixed;
  //width: 400px;
  padding: 20px 20px;
  bottom: 0px;
  left: 50%;
  //margin-left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  text-align: center;
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
      &:first-child {
        margin-left: 0;
      }  
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
    'artefact',
    'commune',
  ],

}
</script>
