import request from '@/utils/request'
export function listAll() {
  return request({
    url: '/nontax/basedata/ticket/all',
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