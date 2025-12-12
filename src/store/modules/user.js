// 用户登录信息
import { createSlice } from "@reduxjs/toolkit";
import { request } from '@/utils/index'

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: ''
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
    }
  }
})

// 解构出actionCreater
const { setToken } = userStore.actions

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

export { fetchLogin, setToken }
export default userReducer