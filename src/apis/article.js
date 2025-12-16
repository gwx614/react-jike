import { request } from "@/utils";

// 获取文章列表
export function getArticleAPI(params) {
  return request({
    url:'/mp/articles',
    method: 'GET',
    params
  })
}