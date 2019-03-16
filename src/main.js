// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import './assets/font/iconfont.css'
import "./assets/css/global.css"
import axios from 'axios'
// axios兼容性解决方案post提交
import qs from 'qs';
Vue.prototype.$qs = qs;

// 全局js
import Base from './base'
Vue.use(Base)

// 网页标题插件productionTip的配置
Vue.config.productionTip = false

// 修改axios原型链
Vue.prototype.$http = axios

// 实例化title参数
Vue.use(require('vue-wechat-title'));

// mouseUI
Vue.use(MuseUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
