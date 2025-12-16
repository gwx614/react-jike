import { request } from "@/utils";

// 获取文章列表
export function getArticleAPI(params) {
  return request({
    url:'/mp/articles',
    method: 'GET',
    params
  })
}

// 删除文章
export function delArticleAPI(id) {
  return request({
    url: `/mp/articles/${id}`,
    method: 'DELETE'
  })
}

// 获取文章
export function getDetailAPI(id) {
  return request({
    url: `/mp/articles/${id}`,
    method: 'GET'
  })
}