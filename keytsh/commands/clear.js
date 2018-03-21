export default () => new Promise((resolve, reject) => {
  resolve($nuxt.$store.dispatch('keytsh/clearBuffer'))
})
