import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index'
import Login from '@/views/login'
import ProcessManage from '@/views/process/manage'
import ProcessAdd from '@/views/process/add'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/process-manage',
        name: 'processManage',
        component: ProcessManage,
        meta: {
          title: '流程管理'
        }
      },
      {
        path: '/process-add',
        name: 'processAdd',
        component: ProcessAdd,
        meta: {
          title: '创建流程',
          isSubPage: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
