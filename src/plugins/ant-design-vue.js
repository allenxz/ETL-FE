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
  Tooltip,
  Table,
  Tag,
  Popconfirm,
  Modal,
  Input,
  Row,
  Col,
  Empty,
  Form,
  message,
  notification,
  Popover,
  Upload,
  Checkbox,
  Select
} from 'ant-design-vue'

Vue.prototype.$message = message
Vue.prototype.$notification = notification

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
Vue.use(Table)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Modal)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Empty)
Vue.use(Form)
Vue.use(Popover)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(Select)
