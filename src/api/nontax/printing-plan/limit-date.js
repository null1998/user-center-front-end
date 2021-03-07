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
/**
 * 删除
 * @param {ID} id 
 */
export function deleteById(id) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date/'+id,
    method: 'delete',
  })
}
/**
 * 更新
 */
export function update(dto) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date',
    method: 'put',
    data: dto
  })
}
/**
 * 根据单位ID查询印制计划上报日期列表
 * @param {单位ID} unitId 
 */
export function listByUnitId(unitId) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date/'+unitId,
    method: 'get'
  })
}
/**
 * 查询是否在上报时间内
 * @param {单位ID} unitId 
 */
export function inRangeOfLimitDate(unitId) {
  return request({
    url: '/nontax/financial/printing/plan/limit/date/in/range/'+unitId,
    method: 'get'
  })
}