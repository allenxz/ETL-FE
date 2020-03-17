import axios from 'axios'
import config from '@/config'

axios.defaults.baseURL = config.API_HOST
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

// request拦截器
axios.interceptors.request.use(
  config => {
    // 根据条件加入token-安全携带
    let userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      config.headers['token'] = JSON.parse(userInfo).token
    }
    return config
  },
  error => {
    // 请求错误处理
    Promise.reject(error)
  }
)

axios.interceptors.response.use(undefined, err => {
  if (err) {
    return Promise.reject(err)
  }
})

axios.interceptors.response.use((res) => {
  if (res && (res.data === '用户未登录，请登录后操作！' || res.data === 'token错误，请查看！')) {
    alert(res.data)
    window.location.href = config.HOST + '/login'
  }
  return res.data
})

export default axios
