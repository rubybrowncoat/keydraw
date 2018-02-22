require('dotenv').config()

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
    '@nuxtjs/dotenv',
    '@nuxtjs/webpackmonitor',
    '@nuxtjs/axios',
  ],

  ...routerBase,

  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },
  axios: {
    proxyHeaders: true,
  }
}
