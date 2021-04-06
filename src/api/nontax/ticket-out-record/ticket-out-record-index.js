import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/ticket/out/record',
    method: 'post',
    data:dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/ticket/out/record/'+id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/ticket/out/record',
    method: 'put',
    data:dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/ticket/out/record/'+id,
    method: 'get'
  })
}
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/ticket/out/record/common/query',
    method: 'get',
    params:params
  })
}