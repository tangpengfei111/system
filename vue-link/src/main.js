import Vue from 'vue';
import App from './App.vue';
import router from './router';
import _ from 'lodash'
import axios from './config/axiosSet.js';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import role from './lib/role.js';

import ('./assets/css/common.css');

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype._ = _;
Vue.use(ElementUI);


// 路由前置守卫
router.beforeEach((to,from,next) => {
  if(to.path ==="/login") {
    sessionStorage.removeItem('user');
    next()
  }else {
    if(sessionStorage.getItem('user')){
      // 根据用户权限，做路由限制
      let user = JSON.parse(sessionStorage.getItem('user'));
      if (role.define[user.role].includes(to.name)) {
        next();
      }
    }else{
      next('/login')
    }
  }
  
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
