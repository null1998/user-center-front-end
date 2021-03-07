import request from '@/utils/request'
export function listAll() {
  return request({
    url: '/nontax/basedata/ticket/all',
    method: 'get'
  })
}