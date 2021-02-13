import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params: params
  })
}

export function getInfo(id) {
  return request({
    url: '/user/info/'+`${id}`,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'delete',
    params: { token }
  })
}
