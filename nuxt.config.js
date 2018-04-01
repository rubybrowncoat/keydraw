require('dotenv').config()

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    mode: 'hash',
    base: process.env.DEPLOY_DIRECTORY || '/keydraw/',
  }
} : {}

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
    '@nuxtjs/dotenv',
    // '@nuxtjs/webpackmonitor',
    '@nuxtjs/axios',

    'nuxt-fontawesome',
  ],

  ...routerBase,

  fontawesome: {
    component: 'fa',
    imports: [
      {
        set: '@fortawesome/fontawesome-free-solid',
        icons: ['faArrowsAlt', 'faLock', 'faKeyboard', 'faSpaceShuttle', 'faCreditCard'],
        // Always import specific icons you need, so that we can avoid loading the entire library of Alexandria of fonts
      },
      // {
      //   set: '@fortawesome/fontawesome-free-regular',
      //   icons: ['faIcon'],
      // },
    ]
  },

  env: {
    API_URL: process.env.API_URL || 'http://127.0.0.1:3000',
    WS_URL: process.env.WS_URL || 'http://127.0.0.1:3000/cable',
  },
  axios: {
    proxyHeaders: true,
  },

  build: {
    extend(config) {
      config.resolve.alias['@fortawesome/fontawesome-free-solid$'] = '@fortawesome/fontawesome-free-solid/shakable.es.js'
      config.resolve.alias['@fortawesome/fontawesome-free-regular$'] = '@fortawesome/fontawesome-free-regular/shakable.es.js'
    }
  },
}
