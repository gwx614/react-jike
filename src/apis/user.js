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