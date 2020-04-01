// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)
//引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


//引入axios
import axios from 'axios';
import App from './App'
import router from './router'
import store from './vuex/store'
import LodopFuncs from './vuex/LodopFuncs'
import alllistmethod from './vuex/alllistmethod'
//挂载在vue原型上
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true
//注册element-ui
Vue.use(ElementUI);
Vue.config.productionTip = false
// 定义域名
const ApiUrl = 'http://dc.daisha.com.cn:8094';
const ApiUrls = 'https://catering.daisha.com.cn:443';
const ApiUrlData = 'http://127.0.0.1:8090';
//挂载域名
Vue.prototype.ApiUrl = ApiUrl;
Vue.prototype.ApiUrls = ApiUrls;
Vue.prototype.ApiUrlData = ApiUrlData;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
