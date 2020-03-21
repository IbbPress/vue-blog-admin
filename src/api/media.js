import { axios } from '@/utils/request'

// const api = {
//   list: '/media/list',
//   del: '/media/',
//   upload: '/media/upload'
// }

export function getMediaList (parameter) {
  return axios({
    url: '/media/list',
    method: 'get',
    params: parameter
  })
}

export function delMedia (id) {
  return axios({
    url: `/media/${id}`,
    method: 'delete'
  })
}
