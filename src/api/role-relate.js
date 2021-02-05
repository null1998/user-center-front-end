import request from '@/utils/request'
export function saveList(dto) {
  request({
    url: '/role/relate/list',
    method: 'post',
    data: dto
  })
}