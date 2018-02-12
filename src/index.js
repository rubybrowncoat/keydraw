import Vue from 'vue'
import VueBootstrap from 'bootstrap-vue'

import VueRouter from 'vue-router'

import routes from './routes'
import store from './store'

import PrincipalLayout from './layouts/Principal'

// import '../styles/global.scss' // sidelined for now

Vue.use(VueBootstrap)
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
})

// Init
new Vue({
  el: '#app',
  render: h => h(PrincipalLayout),
  router,
  store,
})
