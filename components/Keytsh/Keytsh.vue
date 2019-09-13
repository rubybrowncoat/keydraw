<template>
  <div class="keytsh" :class="{
    collapsed: keytshCollapsed,
  }">
    <div class="title-bar">
      <div class="title-piece" @click="toggleKeytshCollapse">KEYTSH</div>
    </div>

    <screen />
    <prompt />
  </div>
</template>

<style lang="scss" scoped>
.keytsh {
  position: fixed;
  bottom: 0;
  right: 0;

  width: 100%;
  height: 100%;

  background-color: rgb(40, 42, 54);

  z-index: 42;
}

.title-bar {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 70px;

  background-color: rgba(40, 42, 54, 0.75);

  z-index: 4;

  .title-piece {
    position: relative;
    float: left;

    top: 17px;
    left: 20px;

    font-family: 'VT323';

    height: 33px;
    font-size: 22px;

    padding: 5px 10px;

    background-color: rgb(249, 249, 245);
    border-radius: 5px;
  }
}

.collapsed {
  display: none;
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex'

import Screen from './Screen'
import Prompt from './Prompt'

export default {
  components: {
    Screen,
    Prompt,
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters('keytsh', [
      'keytshCollapsed',
    ]),
  },
  methods: {
    ...mapActions('keytsh', [
      'toggleKeytshCollapse',
    ]),
  },
}
</script>
