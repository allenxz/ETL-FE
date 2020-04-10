import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index'
import Login from '@/views/login'
import ProcessManage from '@/views/process/manage'
import ProcessEditer from '@/views/process/editer'
import ConfigManage from '@/views/config/manage'
import MysqlReader from '@/views/config/form/mysql-reader'
import MongodbReader from '@/views/config/form/mongodb-reader'
import HDFSReader from '@/views/config/form/hdfs-reader'
import MysqlWriter from '@/views/config/form/mysql-writer'
import MongodbWriter from '@/views/config/form/mongodb-writer'
import HDFSWriter from '@/views/config/form/hdfs-writer'
import DeploymentManage from '@/views/deployment/manage'
import DeploymentEditer from '@/views/deployment/editer'
import Preview from '@/views/preview'
import PermissionApproval from '@/views/permission/approval'
import PermissionRecord from '@/views/permission/record'
import ReportShow from '@/views/report/show'
import ReportDetail from '@/views/report/detail'

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
      },
      {
        path: '/config-manage',
        name: 'configManage',
        component: ConfigManage,
        meta: {
          title: '配置管理'
        }
      },
      {
        path: '/mysqlreader',
        name: 'mysqlReader',
        component: MysqlReader,
        meta: {
          addTitle: '新建MySQL输入配置',
          editTitle: '编辑MySQL输入配置',
          isSubPage: true
        }
      },
      {
        path: '/mongodbreader',
        name: 'mongodbReader',
        component: MongodbReader,
        meta: {
          addTitle: '新建MongoDB输入配置',
          editTitle: '编辑MongoDB输入配置',
          isSubPage: true
        }
      },
      {
        path: '/hdfsreader',
        name: 'HDFSReader',
        component: HDFSReader,
        meta: {
          addTitle: '新建HDFS输入配置',
          editTitle: '编辑HDFS输入配置',
          isSubPage: true
        }
      },
      {
        path: '/mysqlwriter',
        name: 'mysqlWriter',
        component: MysqlWriter,
        meta: {
          addTitle: '新建MySQL输出配置',
          editTitle: '编辑MySQL输出配置',
          isSubPage: true
        }
      },
      {
        path: '/mongodbwriter',
        name: 'mongodbWriter',
        component: MongodbWriter,
        meta: {
          addTitle: '新建MongoDB输出配置',
          editTitle: '编辑MongoDB输出配置',
          isSubPage: true
        }
      },
      {
        path: '/hdfswriter',
        name: 'hdfsWriter',
        component: HDFSWriter,
        meta: {
          addTitle: '新建HDFS输出配置',
          editTitle: '编辑HDFS输出配置',
          isSubPage: true
        }
      },
      {
        path: '/deployment-manage',
        name: 'deploymentManage',
        component: DeploymentManage,
        meta: {
          title: '部署管理'
        }
      },
      {
        path: '/deployment-editer',
        name: 'deploymentEditer',
        component: DeploymentEditer,
        meta: {
          addTitle: '创建部署',
          editTitle: '编辑部署',
          isSubPage: true
        }
      },
      {
        path: '/preview',
        name: 'preview',
        component: Preview,
        meta: {
          editTitle: '预览',
          isSubPage: true
        }
      },
      {
        path: '/permission-approval',
        name: 'permissionApproval',
        component: PermissionApproval,
        meta: {
          title: '权限审批'
        }
      },
      {
        path: '/permission-record',
        name: 'permissionRecord',
        component: PermissionRecord,
        meta: {
          title: '权限查看'
        }
      },
      {
        path: '/report-show',
        name: 'reportShow',
        component: ReportShow,
        meta: {
          title: '任务报告'
        }
      },
      {
        path: '/report-detail',
        name: 'reportDetail',
        component: ReportDetail,
        meta: {
          editTitle: '任务报告详情',
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
