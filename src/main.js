import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ('./assets/css/common.css');


Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(ElementUI)


// 路由前置守卫
router.beforeEach((to,from,next) => {
  if(sessionStorage.getItem('user')){
    next();
  }else{
    if(to.path ==="/login") {
      next()
    }else {
      next('/login')
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
