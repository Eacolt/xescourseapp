import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import End from '@/components/End'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path:'/end',
      name:'End',
      component:End
    }
  ]
})
