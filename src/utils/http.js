import axios from 'axios'
import config from '@/config'

axios.defaults.baseURL = config.API_HOST
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.response.use(undefined, err => {
  if (err) {
    return Promise.reject(err)
  }
})

axios.interceptors.response.use((res) => {
  return res.data
})

export default axios
