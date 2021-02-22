import request from '@/utils/request'
export function saveList(dto) {
  request({
    url: '/user/center/role/relate/list',
    method: 'post',
    data: dto
  })
}