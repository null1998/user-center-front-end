import request from '@/utils/request'
export function listByCategoryName(params) {
  return request({
    url: '/nontax/basedata/dictionary/list/category/name',
    method: 'get',
    params: params
  })
}
