import request from '@/utils/request'
/**
 * 根据单位ID查询印制计划列表
 * @param {单位ID} unitId 
 */
export function listByUnitId(unitId) {
  return request({
    url: '/nontax/financial/printing/plan/list/'+unitId,
    method: 'get'
  })
}