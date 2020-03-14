import axios from 'axios'
import config from '@/config'

axios.defaults.baseURL = config.API_HOST

axios.interceptors.response.use(undefined, err => {
  if (err) {
    return Promise.reject(err)
  }
})

axios.interceptors.response.use((res) => {
  return res.data
})

export default axios
