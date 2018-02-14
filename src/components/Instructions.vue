<template>
  <div class="instructions-container">
    <span class="copyright">
      &copy; 2018 <a href="http://pumo.mp">pumo.mp</a>
    </span>
    <span>KEYS: TOGGLE</span>
    <span>ARROWS: MOVE</span>
    <span>CTRL: SHOW/HIDE</span>
    <span>SPACE: CLEAR</span>
    <span>ALT: THEME</span>
    <span>SHIFT: <span :style="{ color: currentHex }" >COLOR</span></span>

  </div>
</template>

<style lang="scss" scoped>
.instructions-container {
  position: relative;
  width: calc(66vw + 1px);
  top: 80px;
  left: 50%;
  transform: translateX(-50%);

  span {
    margin-right: 25px;
    text-transform: uppercase;

    &.copyright {
      float: right;
      margin-right: 0px;
    }
    .paper & {
      color: #000;
      font-size: 1.1vw;
    }
    .dark & {
      color: #fff;
      font-size: 1.5vw;
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
