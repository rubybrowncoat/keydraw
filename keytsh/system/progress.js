const indeterminate = {
  interval: false,
  uid: '',
}

export const startIndeterminate = async (sequence, title, interval) => {
  if (indeterminate.interval) {
    clearInterval(indeterminate.interval)
  }

  let cycle = sequence.length

  indeterminate.uid = await $nuxt.$store.dispatch('keytsh/addBuffer', {
    composition: [
      [`${sequence[cycle % sequence.length]}`, title],
    ],
  })

  indeterminate.interval = setInterval(() => {
    $nuxt.$store.dispatch('keytsh/replaceBuffer', {
      composition: [
        [`${sequence[cycle % sequence.length]}`, title],
      ],
      uid: indeterminate.uid,
    })

    cycle++
  }, interval)
}

export const stopIndeterminate = () => {
  if (indeterminate.interval) {
    clearInterval(indeterminate.interval)

    $nuxt.$store.dispatch('keytsh/deleteBuffer', indeterminate.uid)
  }

  indeterminate.interval = false
  indeterminate.uid = ''
}
