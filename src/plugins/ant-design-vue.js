import Vue from 'vue'
import {
  message,
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
  Tooltip
} from 'ant-design-vue'

Vue.prototype.$message = message

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
Vue.use(Tooltip)
