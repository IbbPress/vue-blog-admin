import { axios } from '@/utils/request'

const api = {
  list: '/tags',
  blog: '/tags/',
  new: '/tags'
}

// export default api

export function getTagsList (parameter) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function createTag (payload) {
  return axios({
    url: api.new,
    method: 'post',
    data: payload
  })
}

export function delTag (id) {
  return axios({
    url: `/tags/${id}`,
    method: 'delete'
  })
}
export function updateTag (id, payload) {
  return axios({
    url: `/tags/${id}`,
    method: 'put',
    data: payload
  })
}
