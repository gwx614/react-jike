import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '@/store/modules/user'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 获取表单提交的数据
  const onFinish = async (values) => {
    // console.log(values);
    await dispatch(fetchLogin(values))
    // 跳转首页
    navigate('/');
    // 弹框提醒
    message.success('登录成功')
  }

  const [form] = Form.useForm();  // 创建表单实例
  
  useEffect(() => {
    // 组件挂载后验证所有字段
    form.validateFields();
  }, [form]);

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form 
        onFinish={onFinish} 
        validateTrigger={['onBlur']}
          initialValues={{  // 改用 initialValues
          mobile: '13800000002',
          code: '246810'
        }}
        form={form}
        >
            <Form.Item
              name="mobile"
              rules={[
                { required: true, message: '请输入手机号' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号码格式'
                }
              ]}
            >
              <Input size="large" placeholder="请输入手机号" defaultValue='13800000002'/>
            </Form.Item>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入验证码' },
              ]}
            >
              <Input size="large" placeholder="请输入验证码" maxLength={6} defaultValue='246810'/>
            </Form.Item>
          
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                登录
              </Button>
            </Form.Item>
          </Form>
      </Card>
    </div>
  )
}

export default Login