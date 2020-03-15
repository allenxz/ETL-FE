import http from '@/utils/http'

export function post (url, params = {}) {
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
