import request from '@/utils/request'
export function listProvinceZone() {
  return request({
    url: '/nontax/basedata/zone/list/province',
    method: 'get'
  })
}
export function getById(id) {
  return request({
    url: '/nontax/basedata/zone/' + id,
    method: 'get'
  })
}
export function commonQuery(query) {
  return request({
    url: '/nontax/basedata/zone/common/query',
    method: 'get',
    data: query
  })
}
