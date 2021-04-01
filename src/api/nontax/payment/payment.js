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
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/payment/common/query',
    method: 'get',
    params: params
  })
}
