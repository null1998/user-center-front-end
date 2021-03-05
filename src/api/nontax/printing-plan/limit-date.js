import request from '@/utils/request'
/**
 * 新增
 */
export function save(dto) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date',
    method: 'post',
    data: dto
  })
}
export function listByUnitId(unitId) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date'+unitId,
    method: 'get'
  })
}