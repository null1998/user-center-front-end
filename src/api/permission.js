import request from '@/utils/request'
export function listPermission(query) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: query
  })
}