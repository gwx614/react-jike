// 用户登录信息
import { createSlice } from "@reduxjs/toolkit";
import { request } from '@/utils/index'
import { setToken as _setToken, getToken } from "@/utils/index";

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      _setToken(action.payload)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    }
  }
})

// 解构出actionCreater
const { setToken, setUserInfo } = userStore.actions

// 获取reducer函数
const userReducer = userStore.reducer

// 异步函数
// 获取登录token
const fetchLogin = (form) => {
  return async (dispatch) => {
    const res = await request.post('/authorizations', form);
    dispatch(setToken(res.data.token))
  }
}

// 获取个人信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await request.get('/user/profile')
    dispatch(setUserInfo(res.data))
  }
}

export { fetchLogin, fetchUserInfo}
export default userReducer