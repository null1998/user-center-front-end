import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/center/user/login',
    method: 'get',
    params: params
  })
}

export function getInfo() {
  return request({
    url: '/user/center/user/info',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/user/op/logout',
    method: 'delete',
    params: { token }
  })
}
export function listAll() {
  return request({
    url: '/user/center/user/all',
    method: 'get'
  })
}
export function save(dto) {
  return request({
    url: '/user/center/user',
    method: 'post',
    data: dto
  })
}
export function removeById(id) {
  return request({
    url: '/user/center/user/' + id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/user/center/user',
    method: 'put',
    data: dto
  })
}

