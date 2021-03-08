import request from '@/utils/request'
/**
 * 保存
 * @param {印制计划票据} dto 
 * @returns 
 */
export function save(dto) {
  return request({
    url: '/nontax/financial/printing/plan/ticket',
    method: 'post',
    data:dto
  })
}
/**
 * 
 * @param {批量保存} dto 
 * @returns 
 */
export function saveList(dto) {
  return request({
    url: '/nontax/financial/printing/plan/ticket/list',
    method: 'post',
    data:dto
  })
}
/**
 * 删除
 * @param {id} id 
 * @returns 
 */
export function deleteById(id) {
  return request({
    url: '/nontax/financial/printing/plan/ticket/'+id,
    method: 'delete'
  })
}
/**
 * 更新
 * @param {印制计划票据} dto 
 * @returns 
 */
export function update(dto) {
  return request({
    url: '/nontax/financial/printing/plan/ticket',
    method: 'put',
    data:dto
  })
}
/**
 * 根据印制计划id查询票据列表
 * @param {印制计划id} printingPlanId 
 * @returns 
 */
export function listByPrintingPlanId(printingPlanId) {
  return request({
    url: '/nontax/financial/printing/plan/ticket/list/'+printingPlanId,
    method: 'get'
  })
}