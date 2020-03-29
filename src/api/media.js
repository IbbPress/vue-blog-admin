import { axios } from '@/utils/request'

// const api = {
//   list: '/media/list',
//   del: '/media/',
//   upload: '/media/upload'
// }

export function getMediaList (parameter) {
  return axios({
    url: '/media',
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

export function delMediaList (list) {
  return axios({
    url: '/media',
    method: 'delete',
    data: {
      ids: list
    }
  })
}
