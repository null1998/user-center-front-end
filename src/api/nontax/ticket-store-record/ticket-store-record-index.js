import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/ticket/store/record',
    method: 'post',
    data:dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/ticket/store/record/'+id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/ticket/store/record',
    method: 'put',
    data:dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/ticket/store/record/'+id,
    method: 'get'
  })
}
/**
 * 通用查询，支持字段id，unitId
 * @param ticketStoreRecordQO 票据入库记录
 * @return 票据入库记录列表
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/ticket/store/record/common/query',
    method: 'get',
    params:params
  })
}