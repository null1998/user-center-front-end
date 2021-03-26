import request from '@/utils/request'
/**
 * 根据条件（资源名，动作）查询权限列表
 */
export function listPermission(query) {
  return request({
    url: '/user/center/permission/list',
    method: 'get',
    params: query
  })
}
/**
 * 新增
 */
export function save(dto) {
  return request({
    url: '/user/center/permission',
    method: 'post',
    data: dto
  })
}
/**
 * 编辑
 */
export function update(dto) {
  return request({
    url: '/user/center/permission',
    method: 'put',
    data: dto
  })
}
/**
 * 删除
 */
export function deleteById(id) {
  return request({
    url: '/user/center/permission/'+id,
    method: 'delete'
  })
}
export function getById(id) {
  return request({
    url: '/user/center/permission/'+id,
    method: 'get'
  })
}