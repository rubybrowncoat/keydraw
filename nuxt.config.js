const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    mode: 'hash',
    base: '/keydraw/'
  }
} : {}

module.exports = {
  mode: "spa",
  css: [
    '~/assets/main.scss'
  ],

  head: {
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: 'favicon2.png',
      },
    ],
  },

  modules: [
    '@nuxtjs/webpackmonitor',
  ],

  ...routerBase,
}
