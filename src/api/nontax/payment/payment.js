import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/payment',
    method: 'post',
    data: dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/payment/' + id,
    method: 'delete'
  })
}
export function deleteAll(dtoList) {
  return request({
    url: '/nontax/financial/payment/all',
    method: 'delete',
    data: dtoList
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/payment',
    method: 'put',
    data: dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/payment/' + id,
    method: 'get'
  })
}

/**
 * 通用查询，支持字段id,srcUnitId
 * @param payment 票据结算
 * @return 票据结算列表
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/payment/common/query',
    method: 'get',
    params: params
  })
}
