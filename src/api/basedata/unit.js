import request from '@/utils/request'
export function listAll() {
  return request({
    url: '/nontax/basedata/unit/all',
    method: 'get'
  })
}
/**
 * 通用查询，支持字段id，zoneId，dictionaryId
 * @param {*} params
 * @returns
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/basedata/unit/common/query',
    method: 'get',
    params: params
  })
}
