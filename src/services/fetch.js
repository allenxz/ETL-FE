import http from '@/utils/http'

export function post (url, data = {}) {
  // 处理参数
  let params = new URLSearchParams()
  let keys = Object.keys(data)
  for (let key of keys) {
    params.append(key, data[key])
  }
  return new Promise((resolve, reject) => {
    http({
      url: url,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  post
}
