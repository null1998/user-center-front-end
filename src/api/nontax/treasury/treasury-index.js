import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/treasury',
    method: 'post',
    data:dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/treasury/'+id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/treasury',
    method: 'put',
    data:dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/treasury/'+id,
    method: 'get'
  })
}
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/treasury/common/query',
    method: 'get',
    params:params
  })
}