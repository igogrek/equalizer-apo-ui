import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'equalizer',
      component: require('@/components/Equalizer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
