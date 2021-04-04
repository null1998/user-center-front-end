import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/ticket/store',
    method: 'post',
    data: dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/ticket/store/' + id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/ticket/store',
    method: 'put',
    data: dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/ticket/store/' + id,
    method: 'get'
  })
}
/**
 * 通用查询，支持字段id，unitId，ticketId
 * @param ticketStoreQO 票据库存
 * @return 票据库存列表
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/ticket/store/common/query',
    method: 'get',
    params: params
  })
}
