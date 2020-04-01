import Vue from 'vue'
import Router from 'vue-router'

//引入组件
//import login from '@/components/login'
//import index from '@/view/index/index'
//异步加载
//const login = () => import('@/components/login')
//const index = () => import('@/view/index/index')
//const todaylist = () => import('@/view/todaylist/todaylist')
//const alllist = () => import('@/view/alllist/alllist')
//const home = () => import('@/view/home/home')
//注册路由
Vue.use(Router)

//导出路由
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login')
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/view/index/index'),
      children:[
      {
      path: '',
      name: 'home',
      component: () => import('@/view/home/home')
    },
       {
      path: '/todaylist',
      name: 'todaylist',
      component: () => import('@/view/todaylist/todaylist')
    },
      ]
    }
  ]
})
