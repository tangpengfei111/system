import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/home',
    redirect: '/material',
    name: 'home',
    component: () => import('../views/home.vue'),
    children: [
      {
        path: '/color',
        name: 'color',
        component: () => import('../components/maintain/color.vue'),
        meta: {
          til: '色号管理'
        }
      },
      {
        path: '/customer',
        name: 'customer',
        component: () => import('../components/maintain/customer.vue'),
        meta: {
          til: '客户管理'
        }
      },
      {
        path: '/dyeAgent',
        name: 'dyeAgent',
        component: () => import('../components/maintain/dyeAgent.vue'),
        meta: {
          til: '染化剂管理'
        }
      },
      {
        path: '/machine',
        name: 'machine',
        component: () => import('../components/maintain/machine.vue'),
        meta: {
          til: '设备管理'
        }
      },
      {
        path: '/material',
        name: 'material',
        component: () => import('../components/maintain/material.vue'),
        meta: {
          til: '原料管理'
        }
      },
      {
        path: '/supplier',
        name: 'supplier',
        component: () => import('../components/maintain/supplier.vue'),
        meta: {
          til: '供应商管理'
        }
      },
      {
        path: '/production',
        name: 'production',
        component: () => import('../components/production/index.vue'),
        meta: {
          til: '订单管理'
        }
      },
      {
        path: '/proplan',
        name: 'proplan',
        component: () => import('../components/production/proplan.vue'),
        meta: {
          til: '生产计划'
        }
      },
      {
        path: '/dailyproduction',
        name: 'dailyproduction',
        component: () => import('../components/report/dailyproduction.vue'),
        meta: {
          til: '设备生产记录'
        }
      },
      {
        path: '/stockdetails',
        name: 'stockdetails',
        component: () => import('../components/report/stockdetails.vue'),
        meta: {
          til: '订单详情记录'
        }
      },
  
      {
        path: '/dyestock',
        name: 'dyestock',
        component: () => import('../components/stock/dyestock.vue'),
        meta: {
          til: '染化剂库存'
        }
      },
      {
        path: '/materialstock',
        name: 'materialstock',
        component: () => import('../components/stock/materialstock.vue'),
        meta: {
          til: '原料库存'
        }
      },
      {
        path: '/stocklog',
        name: 'stocklog',
        component: () => import('../components/stock/stocklog.vue'),
        meta: {
          til: '库存日志'
        }
      },
      // {
      //   path: '/stock',
      //   name: 'stock',
      //   component: () => import('../components/stock.vue'),
      // },
      {
        path: '/user',
        name: 'user',
        component: () => import('../components/user.vue'),
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
