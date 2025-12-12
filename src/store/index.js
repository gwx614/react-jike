// 统一导出子模块
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user";

export default configureStore({
  reducer: {
    user: userReducer
  }
})