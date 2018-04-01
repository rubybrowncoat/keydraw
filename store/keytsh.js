import Vue from 'vue'

import {
  findIndex as _findIndex,
  isArray as _isArray,
  isEmpty as _isEmpty,
  isNil as _isNil,
  last as _last
} from 'lodash-es'

import commands from '../keytsh/commands'
import { parseCommand } from '../keytsh/system/parse'

import UidGenerator from '../libs/uid'

const historyUids = new UidGenerator()
const bufferUids = new UidGenerator()

export const state = () => ({
  prompt: '>',

  commandExecution: false,
  commandPrompt: false,

  historyLookup: -1,
  history: [],

  buffer: [],

  keytshCollapsed: true,
})

export const actions = {
  errorCommandFormat({ dispatch }, command) {
    dispatch('addBuffer', {
      composition: [
        `~keytsh ❌ ${command}: command is in the wrong application format. It should return a function.`,
      ],
    })
  },
  errorCommandNotFound({ dispatch }, command) {
    dispatch('addBuffer', {
      composition: [
        `~keytsh ⛔️ ${command}: command not found.`,
      ],
    })
  },

  async executeCommand({ commit, dispatch, getters }, commandLine) {
    const parsed = parseCommand(commandLine)
    const { command, silent, args, argsOriginal } = parsed

    const executor = commands[command]

    dispatch('addHistory', {
      commandLine
    })

    dispatch('addBuffer', {
      composition: [
        `${getters.prompt} ${commandLine}`
      ],
      newline: true,
    })

    if (executor) {
      if (typeof executor === 'function') {
        commit('setCommandExecution', true)

        const output = await executor(parsed)

        dispatch('addBuffer', { composition: output })

        commit('setCommandExecution', false)
      } else {
        dispatch('errorCommandFormat', command)
      }
    } else {
      dispatch('errorCommandNotFound', command)
    }
  },

  executePipe({ commit, dispatch, getters }, pipeLine) {
    const splitLine = pipeLine.split('|')

    dispatch('addHistory', {
      commandLine: pipeLine
    })

    dispatch('addBuffer', {
      composition: [
        `${getters.prompt} ${pipeLine}`,
      ],
      newline: true,
    })

    dispatch('unravelPipe', {
      pipe: splitLine,
    })
  },

  async unravelPipe(
    { commit, dispatch, getters },
    {
      pipe: [ firstCommand, ...splitLine ],
      previousOutput = false,
    },
  ) {
    if (!_isNil(firstCommand)) {
      const mergedCommand = previousOutput
        ? firstCommand + ' ' + previousOutput
        : firstCommand

      const parsed = parseCommand(mergedCommand)
      const { command, args, argsOriginal } = parsed

      const executor = commands[command]

      if (executor) {
        if (typeof executor === 'function') {
          commit('setCommandExecution', true)

          const output = await executor(parsed)

          if (_isEmpty(splitLine)) {
            dispatch('addBuffer', { composition: output })
          } else {
            await dispatch('unravelPipe', {
              pipe: splitLine,
              previousOutput: output,
            })
          }
        } else {
          dispatch('errorCommandFormat', command)
        }
      } else {
        dispatch('errorCommandNotFound', command)
      }
    }

    commit('setCommandExecution', false)
  },

  backHistory({ commit, getters }) {
    const lookup = getters.historyLookup

    if (lookup !== -1) {
      if (lookup !== 0) {
        commit('historyLookup', lookup - 1)
      }
    } else {
      commit('historyLookup', getters.history.length - 1)
    }
  },
  forwardHistory({ commit, getters }) {
    const lookup = getters.historyLookup

    if (lookup !== -1) {
      if (lookup >= getters.history.length - 1) {
        commit('resetHistoryLookup')
      } else {
        commit('historyLookup', lookup + 1)
      }
    }
  },
  addHistory({ commit, getters }, history) {
    const lastHistory = _last(getters.history)

    commit('resetHistoryLookup')

    if (!_isEmpty(lastHistory)) {
      if (history.commandLine === lastHistory.commandLine) {
        return
      }
    }

    commit('addHistory', {
      ...history,

      uid: historyUids.generate()
    })
  },

  clearBuffer({ commit }) {
    commit('clearBuffer')
  },
  addBuffer({ commit }, buffer) {
    const uid = bufferUids.generate()

    commit('addBuffer', {
      ...buffer,

      uid,
    })

    return uid
  },
  replaceBuffer({ commit, getters }, buffer) {
    const bufferIndex = _findIndex(getters.buffer, ['uid', buffer.uid])

    commit('replaceBuffer', {
      buffer,
      index: bufferIndex
    })
  },
  deleteBuffer({ commit, getters }, uid) {
    const bufferIndex = _findIndex(getters.buffer, ['uid', uid])

    if (bufferIndex > -1) {
      commit('deleteBuffer', bufferIndex)
    }
  },

  toggleKeytshCollapse({ commit }, override) {
    commit('toggleKeytshCollapse', override)
  },
}

export const getters = {
  prompt(state) {
    return state.prompt
  },
  commandExecution(state) {
    return state.commandExecution
  },
  commandPrompt(state) {
    return state.commandPrompt
  },

  historyLookup(state) {
    return state.historyLookup
  },
  historyLookupResult(state) {
    return state.history[state.historyLookup]
  },
  history(state) {
    return state.history
  },

  buffer(state) {
    return state.buffer
  },

  keytshCollapsed(state) {
    return state.keytshCollapsed
  },
}

export const mutations = {
  setCommandExecution(state, active) {
    state.commandExecution = active
  },
  setCommandPrompt(state, active) {
    state.commandPrompt = active
  },

  resetHistoryLookup(state) {
    state.historyLookup = -1
  },
  addHistory(state, history) {
    state.history.push(history)
  },
  historyLookup(state, lookup) {
    state.historyLookup = lookup
  },

  clearBuffer(state) {
    state.buffer = []
  },
  addBuffer(state, buffer) {
    if (!buffer.composition || _isEmpty(buffer.composition)) {
      state.buffer.push({
        newline: true,

        uid: buffer.uid,
      })
    } else {
      state.buffer.push(buffer)
    }
  },
  replaceBuffer(state, { buffer, index }) {
    Vue.set(state.buffer, index, buffer)
  },
  deleteBuffer(state, index) {
    Vue.delete(state.buffer, index)
  },

  toggleKeytshCollapse(state, override) {
    if (override) {
      state.keytshCollapsed = override

      return
    }

    state.keytshCollapsed = !state.keytshCollapsed
  },
}
