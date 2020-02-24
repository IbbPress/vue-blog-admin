import { axios } from '@/utils/request'

const api = {
  list: '/blog/list',
  new: '/blog/new'
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
