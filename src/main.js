import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.prototype.$HTTP = Axios
Vue.use(ElementUI)
Vue.config.productionTip = false
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
Axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
  // 必须返回config
  return config
})
// 在response拦截器中，隐藏进度条
Axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
