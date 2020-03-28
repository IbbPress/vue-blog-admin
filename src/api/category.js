import { axios } from '@/utils/request'

const api = {
  list: '/category',
  blog: '/category/',
  new: '/category'
}

// export default api

export function getCateList (parameter) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function createCate (payload) {
  return axios({
    url: api.new,
    method: 'post',
    data: payload
  })
}

export function delCate (id) {
  return axios({
    url: `/category/${id}`,
    method: 'delete'
  })
}
export function updateCate (id, payload) {
  return axios({
    url: `/category/${id}`,
    method: 'put',
    data: payload
  })
}
