import Simple from './containers/Simple'
import SimpleInactive from './containers/SimpleInactive'

const routes = [
  { path: '/', component: Simple },
  { path: '/export/:magic', component: SimpleInactive },
  { path: '*', redirect: '/' }
]

export default routes
