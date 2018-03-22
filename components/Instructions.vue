<template>
  <div class="instructions-container">
    <span class="name">
      Keydraw
    </span>

    <div class="menu active" v-show="!artefact">
      <span class="menuItem"><span class="label">ARROWS</span>MOVE</span>
      <span class="menuItem" v-show="!commune"><span class="label">&#8679;+ARROWS</span>RESIZE</span>
      <span class="menuItem"><span class="label">SPACE</span>COLOR<span :class="['colorTile', currentName]"></span></span>
      <span class="menuItem"><span class="label">KEYS</span>TOGGLE</span>

      <span class="menuItem"><span class="label">&#9003;</span>CLEAR</span>
      <span class="menuItem" v-show="!commune"><span class="label">I/O</span>THEME<span class="themeName">{{currentTheme}}</span></span>
    </div>

    <div class="menu" v-show="artefact">
      <!--<span class="menuItem"><span class="label">&#9003;</span>EDIT</span>-->
    </div>
    <span class="copyright">
      &copy; 2018 <a href="http://pumo.mp">pumo.mp</a>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.instructions-container {
  position: relative;
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-size: 22px;

  .name {
    float: left;
    padding: 3px 7px;
    margin-top: -3px;
    height: 30px;

  }
  .menu {
    .menuItem {
      display: inline-block;
      margin-bottom: 15px;
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
    .colorTile {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 10px;
      top: 3px;
    }
    .themeName {
      position: relative;
      margin-left: 10px;
      font-size: 15px;
      padding: 2px 4px;
      top: -2px
    }
  }

  .copyright {
    margin-left: 15px;
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
  computed: {
    ...mapGetters('color', ['currentName']),
    ...mapGetters('theme', ['currentTheme']),
    ...mapGetters('grid', ['actives']),
  }
}
</script>
