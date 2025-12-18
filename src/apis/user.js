// user相关的所有请求
import { request } from "@/utils"

// 登录请求
export function loginAPI(form) {
  return request({
    url: '/authorizations',
    method: 'POST',
    data: form
  })
}

// 用户信息请求
export function userInfoAPI() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}

// 获取用户基本信息和统计数据
export function getUserStatsAPI() {
  return request({
    url: '/user',
    method: 'GET'
  })
}

// 更新用户照片
export function updateUserPhotoAPI(file) {
  const formData = new FormData()
  formData.append('photo', file)
  return request({
    url: '/user/photo',
    method: 'PATCH',
    data: formData
  })
}