import request from '@/utils/request'
/**
 * 根据条件（角色名，角色类型）查询角色列表
 */
export function listRole(query) {
  return request({
    url: '/user/center/role/list',
    method: 'get',
    params: query
  })
}
/**
 * 新增
 */
export function save(dto) {
  return request({
    url: '/user/center/role',
    method: 'post',
    data: dto
  })
}
/**
 * 编辑
 */
export function update(dto) {
  return request({
    url: '/user/center/role',
    method: 'put',
    data: dto
  })
}
/**
 * 删除
 */
export function deleteById(id) {
  return request({
    url: '/user/center/role/'+id,
    method: 'delete'
  })
}