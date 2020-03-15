import Vue from 'vue'
import {
  Pagination,
  Button,
  LocaleProvider,
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Avatar,
  Dropdown,
  Divider,
  message
} from 'ant-design-vue'
Vue.use(LocaleProvider)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(Icon)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(Divider)

Vue.prototype.$message = message
