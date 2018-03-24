<template>
  <div class="instructions-container">
    <span class="name">Keydraw<span class="txtLabel" v-show="commune">commune</span>
      <span class="txtLabel" v-show="artefact">artefact</span>
    </span>


    <div class="menu active" v-show="!artefact">
      <!-- MOVE -->      
      <span class="menuItem"><span class="label"><i class="fas fa-arrows-alt"></i></span>MOVE</span>
      <!-- SIZE -->  
      <span class="menuItem" v-show="!commune">
        <span class="label">&#8679;&nbsp;<i class="fas fa-arrows-alt"></i></span>SIZE<span class="txtLabel">{{gridWidth}}&#215;{{gridHeight}}</span>
      </span>

      <span class="menuItem lock" v-show="commune">
        <span class="label" v-show="commune"><i class="fas fa-lock"></i></span>SIZE<span class="txtLabel">{{gridWidth}}&#215;{{gridHeight}}</span>
      </span>

      <!-- TOGGLE -->  
      <span class="menuItem"><span class="label"><i class="fas fa-keyboard"></i></span>TOGGLE</span>
      <!-- CLEAR -->  
      <span class="menuItem" v-show="!commune"><span class="label">&#9003;</span>CLEAR</span>
      <!-- COLOR -->  
      <span class="menuItem"><span class="label"><i class="fas fa-space-shuttle"></i></span>COLOR<span :class="['colorLabel', currentName]"></span></span>
      <!-- THEME-->  
      <span class="menuItem" v-show="!commune"><span class="label">I/O</span>THEME<span class="txtLabel">{{currentTheme}}</span></span>

      <span class="menuItem lock" v-show="commune"><span class="label" v-show="commune"><i class="fas fa-lock"></i></span>THEME<span class="txtLabel">{{currentTheme}}</span></span>

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
    padding: 5px 10px;
    height: 33px;
    border-radius: 5px;

  }
  .menu {
    .menuItem {
      display: inline-block;
      height: 33px;
      margin-bottom: 15px;
      margin-left: 20px;
      white-space: nowrap;
      border-width:: 0px;
      border-style: solid;
      padding: 5px 8px;
      border-radius: 5px;
      vertical-align: middle;

      .label {
        font-size: 15px;
        margin-left: 5px;
        margin-right: 10px;

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
  .copyright {
    margin-left: 15px;
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
