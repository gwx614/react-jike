import { request } from "@/utils";

// 获取频道列表
export function fetchChannels() {
  return request({
    url: '/channels',
    method: 'GET'
  })
}

// 提交文章
export function createArticleAPI(formData) {
  return request({
    url: '/mp/articles?draft=false',
    method: 'POST',
    data: formData 
  })
}

// 更新文章
export function updateArticleAPI(id, formData) {
  return request({
    url: `/mp/articles/${id}`,
    method: 'PUT',
    data: formData
  })
}
 