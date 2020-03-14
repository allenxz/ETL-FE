import http from '@/utils/http'

export function login ({ username, password }) {
  return http.post('/login', {
    username,
    password
  })
}
