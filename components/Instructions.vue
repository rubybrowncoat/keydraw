<template>
  <div class="instructions-container">
    <span class="name">
      Keydraw
      <span class="txtLabel" v-if="commune">commune</span>
      <span class="txtLabel" v-else-if="artefact">artefact</span>
    </span>
    <div class="menu active">
      <!-- MOVE -->
      <span class="menuItem" v-if="!artefact">
        <span class="label">
          <fa :icon="['fas', 'arrows-alt']" />
        </span>
        MOVE
      </span>

      <!-- TOGGLE -->
      <span class="menuItem" v-if="!artefact">
        <span class="label">
          <fa :icon="['fas', 'keyboard']" />
        </span>
        TOGGLE
      </span>

      <!-- CLEAR -->
      <span class="menuItem" v-if="!commune && !artefact">
        <span class="label">
          &#9003;
        </span>
        CLEAR
      </span>

      <!-- COLOR -->
      <span class="menuItem" v-if="!artefact">
        <span class="label">
          <fa :icon="['fas', 'space-shuttle']" />
        </span>
        COLOR <span :class="['colorLabel', currentName]"></span>
      </span>

      <!-- SIZE -->
      <span :class="['menuItem', {lock: commune}]" v-if="!artefact">
        <span class="label" v-if="commune">
          <fa :icon="['fas', 'lock']" />
        </span>
        <span class="label" v-else>
          &#8679;&nbsp;<fa :icon="['fas', 'arrows-alt']" />
        </span>
        SIZE <span class="txtLabel">{{gridWidth}}&#215;{{gridHeight}}</span>
      </span>

      <!-- THEME-->
      <span :class="['menuItem', {lock: commune}]" v-if="!artefact">
        <span class="label" v-if="commune">
          <fa :icon="['fas', 'lock']" />
        </span>
        <span class="label" v-else>
          I/O
        </span>
        THEME <span class="txtLabel">{{currentTheme}}</span>
      </span>

      <!-- COPY -->
      <span class="menuItem" v-if="commune || artefact">
        <span class="label">
          <fa :icon="['fas', 'at']" />
        </span>
        URL
      </span>
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
