import request from '@/utils/request'

export function save(dto) {
  return request({
    url: '/nontax/financial/printing/order',
    method: 'post',
    data: dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/printing/order/' + id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/printing/order',
    method: 'put',
    data: dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/printing/order/' + id,
    method: 'get'
  })
}
/**
 * 通用查询，支持id，unitId，printUnitId，status字段
 * @param {} params
 * @returns
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/printing/order/common/query',
    method: 'get',
    params: params
  })
}
export function autoStore(dto) {
  return request({
    url: '/nontax/financial/printing/order/auto/store',
    method: 'post',
    data: dto
  })
}
