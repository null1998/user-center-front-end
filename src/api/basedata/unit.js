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
/**
 * 获取该单位的所有上级单位（包括上级的上级）
 * @param {id} id 
 * @returns 
 */
export function getSuperiorUnitList(id) {
  return request({
    url: '/nontax/basedata/unit/superior/' + id,
    method: 'get',
  })
}