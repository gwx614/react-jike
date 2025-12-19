import { message } from "antd"
import { Navigate } from "react-router-dom"
import { getToken } from "@/utils"

const AuthRoute = ({ children }) => {
  const token = getToken()
  
  if(token) {
    return <>{ children }</>
  } else {
    message.error('请先登录')
    return <Navigate to={'/login'} replace></Navigate>
  }
}

export default AuthRoute