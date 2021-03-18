import request from '@/utils/request'
export function save(dto) {
  return request({
    url: '/nontax/financial/printing/order/ticket',
    method: 'post',
    data:dto
  })
}
export function saveList(dto) {
  return request({
    url: '/nontax/financial/printing/order/ticket/list',
    method: 'post',
    data:dto
  })
}
export function deleteById(id) {
  return request({
    url: '/nontax/financial/printing/order/ticket'+id,
    method: 'delete'
  })
}
export function update(dto) {
  return request({
    url: '/nontax/financial/printing/order/ticket',
    method: 'put',
    data:dto
  })
}
/**
 * 
 * @param {印制订单id} printingOrderId 
 * @returns 
 */
export function listByPrintingOrderId(printingOrderId) {
  return request({
    url: '/nontax/financial/printing/order/ticket/printing/order/'+printingOrderId,
    method: 'get'
  })
}