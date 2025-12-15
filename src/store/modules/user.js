// 用户登录信息
import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, getToken, removeToken } from "@/utils/index";
import { loginAPI, userInfoAPI } from "@/apis/user";

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
    },
    clearUserInfo(state) {
      state.userInfo = {};
      state.token = '';
      removeToken();
    }
  }
})

// 解构出actionCreater
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

// 获取reducer函数
const userReducer = userStore.reducer

// 异步函数
// 获取登录token
const fetchLogin = (form) => {
  return async (dispatch) => {
    const res = await loginAPI(form)
    dispatch(setToken(res.data.token))
  }
}

// 获取个人信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await userInfoAPI()
    dispatch(setUserInfo(res.data))
  }
}

export { fetchLogin, fetchUserInfo, clearUserInfo}
export default userReducer