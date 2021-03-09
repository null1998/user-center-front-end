import request from '@/utils/request'
/**
 * 保存
 * @param {印制计划} dto 
 * @returns 
 */
export function save(dto) {
  return request({
    url: '/nontax/financial/printing/plan',
    method: 'post',
    data:dto
  })
}
/**
 * 删除
 * @param {ID} id 
 * @returns 
 */
export function deleteById(id) {
  return request({
    url: '/nontax/financial/printing/plan/'+id,
    method: 'delete'
  })
}
/**
 * 更新
 * @param {印制计划} dto 
 * @returns 
 */
export function update(dto) {
  return request({
    url: '/nontax/financial/printing/plan',
    method: 'put',
    data:dto
  })
}
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
/**
 * 根据ID查询
 * @param {ID} id 
 * @returns 
 */
export function getById(id) {
  return request({
    url: '/nontax/financial/printing/plan/'+id,
    method: 'get'
  })
}
/**
 * 根据父单位ID,印制计划状态,年度，查询子单位的印制计划列表
 * @param {父单位ID,印制计划状态,年度} params 
 * @returns 
 */
export function listByParentUnitIdAndStatusAndYear(params) {
  return request({
    url: '/nontax/financial/printing/plan/list',
    method: 'get',
    params: params
  })
}