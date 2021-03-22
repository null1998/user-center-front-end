import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // }
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
      meta:{title: '票据管理',icon: 'el-icon-s-management',roles:['票据-查询与编辑']}
    }]
  },
  {
    path: '/permission',
    component: Layout,
    meta: {
          title: '权限管理',
          icon: 'form',
          roles: ['权限编辑者','用户中心超级管理员']
        },
    children: [
      {
        path: 'index',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        meta: {
          title: '权限管理',
          icon: 'form',
          roles: ['权限编辑者','用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    meta: {
          title: '角色管理',
          icon: 'form',
          roles: ['角色编辑者','用户中心超级管理员']
        },
    children: [
      {
        path: 'index',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: {
          title: '角色管理',
          icon: 'form',
          roles: ['角色编辑者','用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: {
          title: '用户管理',
          icon: 'form',
          roles: ['用户编辑者','用户中心超级管理员']
        },
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {
          title: '用户管理',
          icon: 'form',
          roles: ['用户编辑者','用户中心超级管理员']
        }
      }
    ]
  },
  {
    path: '/nontax/printing/plan',
    component: Layout,
    meta: { title: '印制计划', icon: 'el-icon-date',roles: ['财政票据系统路由角色']},
    children: [
      {
        path: 'limit-date',
        name: 'limit-date',
        component: () => import('@/views/nontax/printing-plan/limit-date/index'),
        meta: { title: '印制计划上报设置', icon: 'el-icon-upload', roles: ['印制计划时间限制-查询与编辑'] }
      },
      {
        path: 'subordinate-review',
        name: 'subordinate-review',
        component: () => import('@/views/nontax/printing-plan/subordinate-review/index'),
        meta: { title: '下级印制计划审核', icon: 'el-icon-s-check', roles: ['印制计划-查询与审核'] }
      },
      {
        path: 'printing-plan',
        name: 'printing-plan',
        component: () => import('@/views/nontax/printing-plan/index'),
        meta: { title: '本级印制计划维护', icon: 'el-icon-edit', roles: ['印制计划-查询与编辑'] }
      },
      {
        path: 'printing-order',
        name: 'printing-order',
        component: () => import('@/views/nontax/printing-order/index'),
        meta: { title: '省级财政印制订单', icon: 'el-icon-s-order', roles: ['印制订单-查询与编辑'] }
      },
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
          title: '印制订单进度',
          icon: 'form',
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
          title: '票据生产记录',
          icon: 'form',
          roles:['票据生产记录-查询与编辑']
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