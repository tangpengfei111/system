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
        path: '/productionorder',
        name: 'productionorder',
        component: () => import('../components/production/productionorder.vue'),
        meta: {
          til: '订单管理'
        }
      },
      {
        path: '/productionplan',
        name: 'productionplan',
        component: () => import('../components/production/productionplan.vue'),
        meta: {
          til: '生产计划'
        }
      },

      
      {
        path: '/dayproduction',
        name: 'dayproduction',
        component: () => import('../components/report/dayproduction.vue'),
        meta: {
          til: '日生产报表'
        }
      },
      {
        path: '/yieldrate',
        name: 'yieldrate',
        component: () => import('../components/report/yieldrate.vue'),
        meta: {
          til: '良品率报表'
        }
      },
      {
        path: '/stocklist',
        name: 'stocklist',
        component: () => import('../components/report/stocklist.vue'),
        meta: {
          til: '库存清单报表'
        }
      },
      {
        path: '/stockdetails',
        name: 'stockdetails',
        component: () => import('../components/report/stockdetails.vue'),
        meta: {
          til: '库存流水详情报表'
        }
      },
      



      {
        path: '/stock',
        name: 'stock',
        component: () => import('../components/stock.vue'),
      },
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
