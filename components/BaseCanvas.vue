<template>
  <div class="base-canvas" :class="{
    hide: hidden,
  }">
    <div
      class="display-grid"
      :style="{
        backgroundSize: `${limitedKeySize}px ${limitedKeySize}px`,
        width: `${gridWidth * limitedKeySize}px`,
        height: `${gridHeight * limitedKeySize}px`,
      }"
    >
      <div
        v-for="(active, key) in actives"
        v-if="active.top < gridHeight && active.left < gridWidth"
        :key="key"
        :class="[ 'active-key', active.status ]"
        :style="{
          top: `${active.top * limitedKeySize}px`,
          left: `${active.left * limitedKeySize}px`,
          width: `${limitedKeySize}px`,
          height: `${limitedKeySize}px`,
        }"
      />
      <div
        class="keyboard"
        v-if="keyboardLeft !== undefined && keyboardTop !== undefined"
        v-show="!hidden"
        :style="{
          transform: `translate3d(+${limitedKeySize * keyboardLeft}px, +${limitedKeySize * keyboardTop}px, 0)`,
          width: `${limitedKeySize * keyboardWidth}px`
        }"
      >
        <div
          v-for="{ code, key } in keyboard"
          :key="code"
          :class="[
            `key-${code}`,
            limitedKeySize < 15 ? 'small' : null,
            limitedKeySize < 12 ? 'tiny' : null,
          ]"
          :style="{
            minWidth: `${limitedKeySize}px`,
            width: `${limitedKeySize}px`,
            minHeight: `${limitedKeySize}px`,
            height: `${limitedKeySize}px`,

            lineHeight: `${limitedKeySize}px`,
          }"
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

  .dark & {
    background-image: linear-gradient(to right, #555 1px, transparent 1px), linear-gradient(to bottom, #555 1px, transparent 1px);
    border-color: #555;
  }

  .paper & {
    background-image: linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px);
    border-color: #ddd;
  }

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
  display: flex;
  flex-wrap: wrap;

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

  margin: 0;

  span {
    font-size: 16px;
    display: block;
    text-align: center;
    color: #555;
    margin: 0 !important;
    padding: 0 !important;
  }

  &.small {
    span {
      font-size: 11px;
    }
  }

  &.tiny {
    span {
      font-size: 0;
    }
  }

  .dark & {
    border-color: #555;
  }
  .paper & {
    border-color: #ddd;
  }
  .hide & {
    border-width: 0px;
  }
}
</style>

<script>
import { mapState, mapGetters } from 'vuex'

import { throttle as _throttle } from 'lodash'

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
    windowWidth: window.innerWidth,
  }),
  computed: {
    ...mapGetters('grid', [
      'keyboardWidth',
      'keyboardHeight',

      'gridWidth',
      'gridHeight',

      'actives',
    ]),

    limitedKeySize() {
      return Math.min(Math.floor(( this.windowWidth - 50 ) / this.gridWidth), this.keySize)
    },
  },
  mounted() {
    window.addEventListener('resize', _throttle(() => {
      this.windowWidth = window.innerWidth
    }, 250))
  }
}
</script>
