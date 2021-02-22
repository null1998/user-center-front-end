import request from '@/utils/request'
export function listAll() {
  return request({
    url: '/nontax/basedata/unit/all',
    method: 'get'
  })
}