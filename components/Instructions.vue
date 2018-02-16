<template>
  <div class="instructions-container" :class="{
    hide: inactive,
  }">
    <span class="name">
      Keydraw
    </span>
    <div class="menu active" v-show="!inactive">
      <span class="menuItem"><span class="label">ARROWS</span>MOVE</span>
      <span class="menuItem"><span class="label">SPACE</span><span :style="{ color: currentHex }" >COLOR</span></span>
      <span class="menuItem"><span class="label">KEYS</span>TOGGLE</span>

      <span class="menuItem"><span class="label">⌫</span>CLEAR</span>
      <!-- <span class="menuItem"><span class="label">O</span>THEME</span> -->
      <!--<span class="menuItem">P: PREVIEW</span>-->
      <span class="menuItem"><span class="label">⮐</span><em>ARTEFACT</em></span>
    </div>
    <div class="menu inactive" v-show="inactive">
      <span class="menuItem"><span class="label">⌫</span>EDIT</span>
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
  justify-content: space-between;
  text-transform: uppercase;

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
      margin-right: 12px;

      & .label {
        font-size: 15px;
        border: 1px solid #fff;
        padding: 5px 8px;
        margin-right: 10px;
        border-radius: 5px;
        background-color: #555;

      }
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
  props: [
    'inactive',
  ],
  computed: {
    ...mapGetters('color', ['currentName', 'currentHex']),
  }
}
</script>
