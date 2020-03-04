import { axios } from '@/utils/request'

export function uploadUserInfo (id, payload) {
  return axios({
    url: `/users/${id}`,
    method: 'put',
    data: payload
  })
}
export function getUserInfo (id) {
  return axios({
    url: `/users/${id}`,
    method: 'get'
  })
}
