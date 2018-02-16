const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/keydraw/'
  }
} : {}

module.exports = {
  mode: "spa",
  css: [
    '~/assets/main.scss'
  ],

  ...routerBase,
}
