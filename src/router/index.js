import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/maintain'
  },
  {
    path: '/home',
    redirect: '/maintain',
    name: 'home',
    component: () => import('../views/home.vue'),
    children: [
      {
        path: '/maintain',
        name: 'maintain',
        component: () => import('../components/maintain.vue'),
      },
      {
        path: '/report',
        name: 'report',
        component: () => import('../components/report.vue'),
      },
      {
        path: '/production',
        name: 'production',
        component: () => import('../components/production.vue'),
      },
      {
        path: '/stock',
        name: 'stock',
        component: () => import('../components/stock.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
