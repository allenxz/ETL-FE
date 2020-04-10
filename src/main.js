import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import charts from 'echarts'
Vue.prototype.$echarts = charts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
