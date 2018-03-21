<template>
  <div class="screen">
    <div
      v-for="line in buffer"
      v-bind:key="line.uid"

      :class="{newline: line.newline}">
      <pre v-html="line.text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
input,
textarea,
pre,
code {
  font-family: Monaco, Menlo, 'Courier New', monospace;
}

.screen {
  position: absolute;
  bottom: 0;

  max-height: 100%;
  width: 100%;

  padding-top: 50px;
  padding-bottom: 41px;

  overflow: auto;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: rgb(249, 249, 245);

  .newline {
    margin-top: 15px;
  }

  pre {
    display: block;
    font-weight: bold;
    font-size: 12px;
    padding: 0 25px;
    margin: 5px 0;
    white-space: pre-wrap;
  }
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex'

const easing = (time, base, change, duration) => {
  let dTime = time / (duration / 2)

  if (dTime < 1) {
    return change / 2 * dTime * dTime + base
  }

  dTime--

  return -change / 2 * (dTime * (dTime - 2) - 1) + base
}

export default {
  name: 'screen',
  data: () => ({
    lines: [],
  }),
  computed: {
    ...mapGetters('keytsh', [
      'buffer',
    ]),
  },
  watch: {
    buffer(newBuffer, oldBuffer) {
      if (newBuffer.length >= oldBuffer.length) {
        this.$nextTick(() => {
          this.scrollBottom()
        })
      }
    }
  },
  methods: {
    ...mapActions('keytsh', [
      'addBuffer',
    ]),

    // replaceLastLine(line) {
    //   this.lines[this.lines.length - 1].text = line
    // },
    // removeLastLine() {
    //   this.lines.pop()
    // },

    scrollBottom() {
      let start = this.$el.scrollTop
      let change = this.$el.scrollHeight - (this.$el.clientHeight + this.$el.scrollTop)
      let currentTime = 0
      let increment = 20
      let duration = 100

      let animateScroll = () => {
        currentTime += increment
        let val = easing(currentTime, start, change, duration)
        this.$el.scrollTop = val
        if (currentTime < duration) {
          setTimeout(animateScroll, increment)
        }
      }
      animateScroll()
    },
  },
}
</script>
