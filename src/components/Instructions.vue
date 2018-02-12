<template>
  <div class="instructions-container">
    <span class="copyright">
      &copy; 2018 <a href="http://pumo.mp">pumo.mp</a>
    </span>
    <span>KEYS: TOGGLE</span>
    <span>ARROWS: MOVE</span>
    <span>CTRL: SHOW/HIDE</span>
    <span>SPACE: CLEAR</span>
    <br>
    <span>SHIFT: COLOR</span>
    <span>CURRENT: {{ currentName }}</span>
  </div>
</template>

<style lang="scss" scoped>
.instructions-container {
  position: relative;

  width: calc(66vw + 1px);

  top: 80px;
  left: 50%;

  transform: translateX(-50%);

  color: #fff;
  font-size: 1.5vw;

  margin-bottom: 80px;

  span {
    margin-right: 40px;
    text-transform: uppercase;

    &.copyright {
      float: right;
      margin-right: 0px;
    }
  }

  a {
    text-decoration: none;
    color: #fff;

    &:hover {
      color: #5050c6;
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('color', ['currentName']),
  }
}
</script>
