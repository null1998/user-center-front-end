import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/ticket/out/record/ticket',
    method: 'post',
    data: dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/ticket/out/record/ticket/' + id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/ticket/out/record/ticket',
    method: 'put',
    data: dto
  })
}
export function getById(id) {
  return request({
    url: '/nontax/financial/ticket/out/record/ticket/' + id,
    method: 'get'
  })
}
/**
 * 通用查询，支持字段id,ticketOutRecordId
 * @param ticketOutRecordQO 票据出库记录
 * @return 票据出库记录列表
 */
export function commonQuery(params) {
  return request({
    url: '/nontax/financial/ticket/out/record/ticket/common/query',
    method: 'get',
    params: params
  })
}
