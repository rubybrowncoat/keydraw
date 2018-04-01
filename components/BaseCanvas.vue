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
          width: `calc(${limitedKeySize * keyboardWidth}px + 1px)`
        }"
      >
        <div
          v-for="{ code, key } in keyboard"
          :key="code"
          :class="[
            `key-${code}`,
            limitedKeySize <= 24 ? 'medium' : null,
            limitedKeySize <= 18 ? 'small' : null,
            limitedKeySize <= 12 ? 'tiny' : null,
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
  margin-bottom: 100px;
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
  display: flex;
  top: 0;
  border-width: 1px;
  border-style: solid;
  border-left-width: 0;
  border-top-width: 0;
  box-sizing: border-box;
  flex-wrap: wrap;
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
    font-size: 20px;
    display: block;
    text-align: center;

    margin: 0 !important;
    padding: 0 !important;
  }

  &.medium {
    span {
      font-size: 14px;
    }
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

   .hide & {
    border-width: 0px;
  }
}
</style>

<script>
import { mapState, mapGetters } from 'vuex'

import { throttle as _throttle } from 'lodash-es'

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
  methods: {
    keyResize: _throttle(() => {
      this.windowWidth = window.innerWidth
    }, 250)
  },
  beforeMount() {
    window.addEventListener('resize', this.keyResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.keyResize)
  },
}
</script>
