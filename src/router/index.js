import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '系统主页', icon: 'el-icon-pie-chart' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/basedata/ticket',
    component: Layout,
    children: [{
      path: 'ticket',
      name: 'ticket',
      component: () => import('@/views/basedata/ticket/index'),
      meta: { title: '票据管理', icon: 'el-icon-tickets', roles: ['票据-查询与编辑'] }
    }]
  },
  {
    path: '/basedata/unit',
    component: Layout,
    children: [{
      path: 'unit',
      name: 'unit',
      component: () => import('@/views/basedata/unit/index'),
      meta: { title: '单位管理', icon: 'el-icon-office-building', roles: ['单位-查询与编辑'] }
    }]
  },
  {
    path: '/basedata/zone',
    component: Layout,
    children: [{
      path: 'zone',
      name: 'zone',
      component: () => import('@/views/basedata/zone/index'),
      meta: { title: '区划管理', icon: 'el-icon-map-location', roles: ['行政区划-查询与编辑'] }
    }]
  },
  {
    path: '/basedata/warehouse',
    component: Layout,
    children: [{
      path: 'warehouse',
      name: 'warehouse',
      component: () => import('@/views/basedata/warehouse/index'),
      meta: { title: '仓库管理', icon: 'el-icon-document-copy', roles: ['仓库-查询与编辑'] }
    }]
  },
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        meta: {
          title: '权限管理',
          icon: 'el-icon-setting',
          roles: ['权限编辑者', '用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: {
          title: '角色管理',
          icon: 'el-icon-star-off',
          roles: ['角色编辑者', '用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
          roles: ['用户编辑者', '用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/nontax/printing/plan',
    component: Layout,
    meta: { title: '年度计划', icon: 'el-icon-date', roles: ['财政票据系统路由角色'] },
    children: [
      {
        path: 'limit-date',
        name: 'limit-date',
        component: () => import('@/views/nontax/printing-plan/limit-date/index'),
        meta: { title: '上报日期', roles: ['印制计划时间限制-查询与编辑'] }
      },
      {
        path: 'subordinate-review',
        name: 'subordinate-review',
        component: () => import('@/views/nontax/printing-plan/subordinate-review/index'),
        meta: { title: '计划审核', roles: ['印制计划-查询与审核'] }
      },
      {
        path: 'printing-plan',
        name: 'printing-plan',
        component: () => import('@/views/nontax/printing-plan/index'),
        meta: { title: '计划上报', roles: ['印制计划-查询与编辑'] }
      }
    ]
  },
  {
    path: '/nontax/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'el-icon-document-copy', roles: ['财政票据系统路由角色'] },
    children: [
      {
        path: 'printing-order',
        name: 'printing-order',
        component: () => import('@/views/nontax/printing-order/index'),
        meta: { title: '印制订单', roles: ['印制订单-查询与编辑'] }
      },
      {
        path: 'ticket-claim',
        name: 'ticket-claim',
        component: () => import('@/views/nontax/ticket-claim/index'),
        meta: {
          title: '申领订单',
          roles: ['票据申领-查询与编辑']
        }
      },
      {
        path: 'ticket-claim-review',
        name: 'ticket-claim-review',
        component: () => import('@/views/nontax/ticket-claim/ticket-claim-review/index'),
        meta: {
          title: '下级申领',
          roles: ['票据申领-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/storage',
    component: Layout,
    meta: { title: '库存管理', icon: 'el-icon-files', roles: ['财政票据系统路由角色'] },
    children: [
      {
        path: 'ticket-store-record',
        name: 'ticket-store-record',
        component: () => import('@/views/nontax/ticket-store-record/index'),
        meta: {
          title: '入库记录',
          roles: ['票据入库记录-编辑与查询']
        }
      },
      {
        path: 'ticket-out-record',
        name: 'ticket-out-record',
        component: () => import('@/views/nontax/ticket-out-record/index'),
        meta: {
          title: '出库记录',
          roles: ['票据出库记录-查询与编辑']
        }
      },
      {
        path: 'ticket-storage',
        name: 'ticket-storage',
        component: () => import('@/views/nontax/ticket-storage/index'),
        meta: {
          title: '库存查看',
          roles: ['票据库存-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/order/progress',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'order-progress',
        component: () => import('@/views/nontax/order-progress/index'),
        meta: {
          title: '印制订单',
          icon: 'el-icon-document-copy',
          roles: ['订单进度-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/ticket/product/record',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ticket-product-record',
        component: () => import('@/views/nontax/ticket-product-record/index'),
        meta: {
          title: '票号分配',
          icon: 'el-icon-data-board',
          roles: ['票据生产记录-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/invoice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'invoice',
        component: () => import('@/views/nontax/invoice/index'),
        meta: {
          title: '开票管理',
          icon: 'el-icon-tickets',
          roles: ['开票管理-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/payment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'payment',
        component: () => import('@/views/nontax/payment/index'),
        meta: {
          title: '工本费用',
          icon: 'el-icon-money',
          roles: ['票据结算-查询与编辑']
        }
      }
    ]
  },
  {
    path: '/nontax/treasury',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'treasury',
        component: () => import('@/views/nontax/treasury/index'),
        meta: {
          title: '财政金库',
          icon: 'el-icon-coin',
          roles: ['财政金库-查询与编辑']
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
