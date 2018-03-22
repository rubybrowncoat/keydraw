export default () => new Promise((resolve, reject) => {
  $nuxt.$store.dispatch('keytsh/clearBuffer')
  $nuxt.$store.dispatch('keytsh/toggleKeytshCollapse', true)

  resolve()
})
