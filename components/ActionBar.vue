<template>
  <div class="action-bar">

    <div class="menu active" v-show="!artefact && !commune">
      <span class="menuItem">
        <span class="label">&#11152;</span>
        <em>ARTEFACT</em>
      </span>
      <span class="menuItem">
        <span class="label">&#92;</span>
        <em>COMMUNE</em>
      </span>
    </div>
    
    <div class="menu active" v-show="artefact">
      <span class="menuItem">
        <span class="label">&#9003;</span>EDIT</span>
    </div>

    <div class="menu active" v-show="commune">
      <span class="menuItem"><span class="label">&#9003;</span>GO ALONE</span>
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
 
    .menu {
    .menuItem {
      display: inline-block;
      height: 33px;
      margin-left: 20px;
      white-space: nowrap;
      border-width:: 0px;
      border-style: solid;
      padding: 5px 8px;
      border-radius: 5px;
      vertical-align: middle;
        &:first-child {
        margin-left: 0;
      }  

      .label {
        font-size: 15px;
        margin-left: 5px;
        margin-right: 10px;

      }
      .txtLabel {
        display: inline-block;
        min-width: 50px;
        text-align: center;
        margin-left: 10px;
        font-size: 15px;
        padding: 2px 4px;
        border-radius: 3px;
        position: relative;
        top: -2px;

      }
      .colorLabel {
        display: inline-block;
        min-width: 19px;
        min-height: 19px;
        margin-left: 10px;

        border-radius: 3px;
        position: relative;
        top:2px;

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
