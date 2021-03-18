import request from '@/utils/request'
export function listByUnitId(unitId) {
  return request({
    url: '/nontax/basedata/warehouse/unit/'+unitId,
    method: 'get'
  })
}