<template>
  <span v-if="isString" :class="classes" v-html="composition"></span>
  <span v-else-if="isLine" :class="classes">
    <router-link v-if="options.route" :to="options.route">
      <screenline :composition="this.composition[0]" />
    </router-link>
    <a v-else-if="options.link" :href="options.link" :target="options.blank || ''">
      <screenline :composition="this.composition[0]" />
    </a>
    <screenline v-else :composition="this.composition[0]" />
  </span>
  <span v-else :class="classes">
    <screenline
      v-for="(subComposition, index) in composition"
      v-bind:key="`${prekey}-${index}`"

      :composition="subComposition"
      :prekey="`${prekey}-${index}`" />
  </span>
</template>

<style lang="scss" scoped>
.screenline {
  display: inline-block;

  &:not(:first-of-type) {
    margin-left: 1.1ch;
  }
}
</style>

<script>
import {
  isArray as _isArray,
  isPlainObject as _isPlainObject,
  isString as _isString
} from 'lodash-es'

import classNames from 'classnames'

export default {
  name: 'screenline',
  props: [
    'composition',
    'prekey',
  ],
  data: () => ({
    //
  }),
  computed: {
    isString() {
      return _isString(this.composition)
    },
    isLine() {
      return _isArray(this.composition) && _isPlainObject(this.composition[1])
    },

    options() {
      return this.isLine ? this.composition[1] : {}
    },
    classes() {
      return classNames('screenline', ...(this.options.styles || {}))
    }
  },
}
</script>
