import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index'
import Login from '@/views/login'
import ProcessManage from '@/views/process/manage'
import ProcessEditer from '@/views/process/editer'

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
        path: '/process-editer',
        name: 'processEditer',
        component: ProcessEditer,
        meta: {
          addTitle: '创建流程',
          editTitle: '编辑流程',
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
