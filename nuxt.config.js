require('dotenv').config()

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    mode: 'hash',
    base: process.env.DEPLOY_DIRECTORY || '/keydraw/',
  }
} : {
  //
}

module.exports = {
  mode: 'spa',
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
    'nuxt-clipboard2',

    '@nuxtjs/dotenv',
    // '@nuxtjs/webpackmonitor',
    '@nuxtjs/axios',

    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [{
        set: '@fortawesome/fontawesome-free-solid',
        icons: ['faArrowsAlt', 'faLock', 'faKeyboard', 'faSpaceShuttle', 'faCreditCard'],
      }],
    }],
  ],

  ...routerBase,

  env: {
    API_URL: process.env.API_URL || 'http://127.0.0.1:3000',
    WS_URL: process.env.WS_URL || 'http://127.0.0.1:3000/cable',
  },
  axios: {
    proxyHeaders: true,
  },
}
