import { axios } from '@/utils/request'

const api = {
  list: '/posts',
  blog: '/posts/',
  new: '/posts'
}

// export default api

export function getBlogList (parameter) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function createBlog (payload) {
  return axios({
    url: api.new,
    method: 'post',
    data: payload
  })
}
export function getBlog (id) {
  return axios({
    url: `/posts/${id}`,
    method: 'get'
  })
}
export function updateBlog (id, payload) {
  return axios({
    url: `/posts/${id}`,
    method: 'put',
    data: payload
  })
}
