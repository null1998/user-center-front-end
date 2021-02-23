import request from '@/utils/request'
export function saveList(dto) {
  request({
    url: '/user/center/user/role/list',
    method: 'post',
    data: dto
  })
}