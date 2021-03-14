import request from '@/utils/request'
export function listProvinceZone() {
  return request({
    url: '/nontax/basedata/zone/list/province',
    method: 'get'
  })
}