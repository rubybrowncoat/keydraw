<template>
  <div class="prompt" :class="{disabled: commandExecution}">
    <span class="prompt-string" :class="{'green': commandPrompt, 'paint': commandPrompt, 'bold': commandPrompt}">{{ commandPrompt ? '?' : prompt }}</span>
    <input ref="prompt" type="text"
    v-model="commandLine" @keyup.enter="execute(commandLine)"
    @keyup.up="backHistory()" @keyup.down="forwardHistory()"
    :disabled="commandExecution && !commandPrompt">
  </div>
</template>

<style lang="scss" scoped>
div {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 41px;
  line-height: 41px;
  padding: 0 20px;
  background-color: rgba(40, 42, 54, 0.75);
}

.disabled {
  opacity: 0.5;

  cursor: progress;
}

.prompt {
  color: rgb(249, 249, 245);

  .prompt-string {
    font-weight: bold;
    font-size: 18px;

    margin-right: 10px;
  }

  input {
    width: calc(100% - 50px);
    height: 40px;

    outline: none;
    border: none;

    background: transparent;

    font-weight: bolder;
    font-size: 16px;

    color: rgb(249, 249, 245);
  }
}

input[disabled] {
  cursor: progress;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex'

import { isNil as _isNil } from 'lodash-es'

let preservedCommand = ''

let history = []
let historyIndex = 0

export default {
  name: 'prompt',
  data: () => ({
    commandLine: '',
  }),
  computed: {
    ...mapGetters('keytsh', [
      'prompt',

      'commandExecution',
      'commandPrompt',

      'history',
      'historyLookupResult',

      'buffer',

      'keytshCollapsed',
    ]),
  },
  watch: {
    keytshCollapsed(newCollapsed, oldCollapsed) {
      if (!newCollapsed) {
        this.$nextTick(() => {
          this.$refs.prompt.focus()
        })
      }
    },
    historyLookupResult(newResult, oldResult) {
      if (!_isNil(newResult) && newResult.commandLine) {
        if (_isNil(oldResult)) {
          preservedCommand = this.commandLine
        }

        this.commandLine = newResult.commandLine
      }

      if (_isNil(newResult) && !_isNil(oldResult)) {
        this.commandLine = preservedCommand
      }

      this.setCaretPostion(this.commandLine.length)
    },

    buffer(newBuffer, oldBuffer) {
      if (newBuffer.length >= oldBuffer.length) {
        this.$nextTick(() => {
          this.$refs.prompt.focus()
        })
      }
    }
  },
  methods: {
    ...mapActions('keytsh', [
      'executeCommand',
      'executePipe',

      'backHistory',
      'forwardHistory',
      'addHistory',

      'addBuffer',
    ]),

    execute(command) {
      if (this.commandPrompt) {
        return this.addBuffer({
          text: 'test',
        })
      }

      if (command === '') {
        return this.addBuffer({
          text: this.prompt,
        })
      }

      if (command.indexOf('|') > -1) {
        this.executePipe(command)
      } else {
        this.executeCommand(command)
      }

      this.commandLine = ''
    },
    getCaretPosition() {
      const input = this.$refs.prompt

      if ('selectionStart' in input) {
        return input.selectionStart
      } else if (document.selection) {
        input.focus()

        const sel = document.selection.createRange()
        const selLen = document.selection.createRange().text.length

        sel.moveStart('character', -input.value.length)

        return sel.text.length - selLen
      }
    },
    setCaretPostion(caretPos) {
      const input = this.$refs.prompt

      if (input.createTextRange) {
        const range = input.createTextRange()

        range.move('character', caretPos)
        range.select()
      } else {
        input.focus()

        if (input.selectionStart !== undefined) {
          input.setSelectionRange(caretPos, caretPos)
        }
      }
    },
  },
}
</script>
