<template>
  <div class="base-canvas" :class="{
    hide: hidden,
  }">
    <div
      class="display-grid"
      :style="{
        backgroundSize: `${keySize}px ${keySize}px`,
        width: `${gridWidth * keySize}px`,
        height: `${gridHeight * keySize}px`,
      }"
    >
      <div
        v-for="(active, key) in actives"
        v-if="active.top < gridHeight && active.left < gridWidth"
        :key="key"
        :class="[ 'active-key', active.status ]"
        :style="{
          top: `${active.top * keySize}px`,
          left: `${active.left * keySize}px`,
          width: `${keySize}px`,
          height: `${keySize}px`,
        }"
      />
      <div
        class="keyboard"
        v-if="keyboardLeft !== undefined && keyboardTop !== undefined"
        v-show="!hidden"
        :style="{
          transform: `translate3d(+${keySize * keyboardLeft}px, +${keySize * keyboardTop}px, 0)`,
          width: `${keySize * keyboardWidth}px`
        }"
      >
        <div
          v-for="{ code, key } in keyboard"
          :key="code"
          :class="[ `key-${code}` ]"
          :style="{ width: `${keySize}px`, height: `${keySize}px`}"
        >
          <span>{{ key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-canvas {
  position: relative;

  margin-top: 50px;
  margin-bottom: 40px;
}

.display-grid {
  position: relative;

  left: 50%;
  transform: translateX(-50%);

  border-width: 1px;
  border-style: solid;
  border-top: 0;
  border-left: 0;

  .hide & {
    border-width: 0;
    background: transparent;
  }

  .active-key {
    position: absolute;
    z-index: -1;
  }
}

.keyboard {
  position: absolute;
  display: inline-block;
  top: 0;

  .dark & {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .paper & {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

[class*='key-'] {
  display: inline-block;
  vertical-align: top;
  border-width: 1px;
  border-style: solid;
  border-bottom-width: 0;
  border-right-width: 0;
  opacity: 1 !important;

  padding: 5px;
  margin: 0;

  span {
    font-size: 1vw;
    display: inline;
    color: #555;
    margin: 0 !important;
    padding: 0 !important;
  }

  .hide & {
    border-width: 0px;
  }
}
</style>

<script>

import { mapState, mapGetters } from 'vuex'

import keyboard from '../data/keyboard'

export default {
  props: [
    'hidden',

    'keySize',

    'keyboardLeft',
    'keyboardTop',
  ],
  data: () => ({
    keyboard,
  }),
  computed: {
    ...mapGetters('grid', [
      'keyboardWidth',
      'keyboardHeight',

      'gridWidth',
      'gridHeight',

      'actives',
    ]),
  },
}
</script>
