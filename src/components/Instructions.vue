<template>
  <div class="instructions-container">
    <span class="name">
      Keydraw
    </span>
    <div class="menu">
      <span class="menuItem">KEYS: TOGGLE</span>
      <span class="menuItem">ARROWS: MOVE</span>
      <span class="menuItem">CTRL: SHOW/HIDE</span>
      <span class="menuItem">SPACE: CLEAR</span>
      <span class="menuItem">ALT: THEME</span>
      <span class="menuItem">SHIFT: <span :style="{ color: currentHex }" >COLOR</span></span>
      <span class="menuItem">ENTER: GO TO <em>ARTEFACT</em></span>
    </div>
    <span class="copyright">
      &copy; 2018 <a href="http://pumo.mp">pumo.mp</a>
    </span>

  </div>
</template>

<style lang="scss" scoped>
.instructions-container {
  position: relative;
  width: 80%;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  display: flex;
  justify-content: space-around;
  text-transform: uppercase;
  //border-bottom: 1px solid #555;
  //padding-bottom: 20px;

  & .name {
    float: left;
    padding: 3px 7px;
    margin-top: -3px;
    .dark & {
      background-color: #fff;
      color: #444444;
    }
    .paper & {
      background-color: #000;
      color: #fffced;
    }

  }
  & .menu {
    & .menuItem {
      margin-right: 20px;
    }
  }
  & .copyright {
    float: right;
  }
  .paper & {
    color: #000;
    font-size: calc(10px + 0.3vw);
    & a {
      color: #000;
      text-decoration: none;
    }
  }
  .dark & {
    color: #fff;
    font-size: calc(10px + 0.8vw);
    & a {
      color: #fff;
      text-decoration: none;
    }
  }

}

</style>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('color', ['currentName', 'currentHex']),
  }
}
</script>
