import request from '@/utils/request'
export function saveList(dto) {
  request({
    url: '/user/center/role/permission/list',
    method: 'post',
    data: dto
  })
}
export function listByRoleId(id) {
  return request({
    url: '/user/center/role/permission/list/' + id,
    method: 'get'
  })
}
