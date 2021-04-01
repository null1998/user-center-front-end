import request from '@/utils/request'
export function listByUnitId(unitId) {
  return request({
    url: '/nontax/basedata/warehouse/unit/' + unitId,
    method: 'get'
  })
}
/**
 * 通用查询。支持字段id，unitId
 * @param {*} params
 * @returns
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/basedata/warehouse/common/query',
    method: 'get',
    params: params
  })
}
