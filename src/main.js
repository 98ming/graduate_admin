// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vchars from 'v-charts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://127.0.0.1:3000';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

Vue.prototype.$axios = axios;

Vue.use(ElementUI);
Vue.use(Vchars);

import '@/styles/index.scss'

import store from './store/index'
import '@/icons';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
