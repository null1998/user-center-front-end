import request from '@/utils/request'
export function listAll() {
  return request({
    url: '/nontax/basedata/ticket/all',
    method: 'get'
  })
}
export function listByZoneId(zoneId) {
  return request({
    url: '/nontax/basedata/ticket/list/zone/'+zoneId,
    method: 'get'
  })
}
export function save(dto) {
  return request({
    url: '/nontax/basedata/ticket',
    method: 'post',
    data:dto
  })
}
export function update(dto) {
  return request({
    url: '/nontax/basedata/ticket',
    method: 'put',
    data:dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/basedata/ticket/'+id,
    method: 'delete'
  })
}
/**
 * 通用查询。支持字段id，zoneId，year，name
 * @param {*} params 
 * @returns 
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/basedata/ticket/common/query',
    method: 'get',
    params:params
  })
}