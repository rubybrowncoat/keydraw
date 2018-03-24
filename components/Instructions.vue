<template>
  <div class="instructions-container">
    <span class="name">
      Keydraw<span class="qualifier" v-show="commune"> commune</span>
    </span>


    <div class="menu active" v-show="!artefact">
      <!-- MOVE -->      
      <span class="menuItem"><span class="label"><i class="fas fa-arrows-alt"></i></span>MOVE</span>
      <!-- SIZE -->  
      <span class="menuItem">
        <span class="label" v-show="!commune">&#8679;&nbsp;<i class="fas fa-arrows-alt"></i></span><span class="label lock" v-show="commune"><i class="fas fa-lock"></i></span>SIZE<span class="txtLabel">{{gridWidth}}&#215;{{gridHeight}}</span>
      </span>
      <!-- TOGGLE -->  
      <span class="menuItem"><span class="label"><i class="fas fa-keyboard"></i></span>TOGGLE</span>
      <!-- CLEAR -->  
      <span class="menuItem" v-show="!commune"><span class="label">&#9003;</span>CLEAR</span>
      <!-- COLOR -->  
      <span class="menuItem"><span class="label"><i class="fas fa-space-shuttle"></i></span>COLOR<span :class="['colorLabel', currentName]">{{currentName}}</span></span>
      <!-- THEME-->  
      <span class="menuItem"><span class="label" v-show="!commune">I/O</span><span class="label lock" v-show="commune"><i class="fas fa-lock"></i></span>THEME<span class="txtLabel">{{currentTheme}}</span></span>

    </div>

    <div class="menu" v-show="artefact">
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
      margin-left: 20px;
      white-space: nowrap;
      position: relative;
      .label {
        font-size: 15px;
        border-width: 1px;
        border-style: solid;
        padding: 5px 8px;
        margin-right: 10px;
        border-radius: 5px;
      }
      .colorTile {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-left: 10px;
        top: 3px;
        border-radius: 3px;
        background-size: 100%;
        border-width: 1px;
        border-style: solid;
      }
      .txtLabel,
      .colorLabel {
        display: inline-block;
        min-width: 50px;
        position: relative;
        text-align: center;
        margin-left: 10px;
        font-size: 15px;
        padding: 2px 4px;
        top: -2px;
        border-radius: 5px;
      }
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
    ...mapGetters('grid', [
      'keyboardWidth',
      'keyboardHeight',

      'gridWidth',
      'gridHeight',

      'actives',
      ]),
  }
}


</script>
