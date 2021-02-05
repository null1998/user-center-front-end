import request from '@/utils/request'
export function saveList(dto) {
  request({
    url: '/role/permission/list',
    method: 'post',
    data: dto
  })
}