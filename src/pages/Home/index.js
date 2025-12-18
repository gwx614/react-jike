
import { useState, useEffect, memo } from 'react'
import { BarChart } from './components/BarChart'
import './index.scss'
import { getUserStatsAPI } from '@/apis/user'
import { Form, Input, Button, Radio, DatePicker, message } from 'antd'
import { request } from '@/utils'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const { TextArea } = Input

const Home = memo(() => {
  // 用户统计图表状态
  const [userStatsChart, setUserStatsChart] = useState({
    xData: ['文章数', '关注数', '粉丝数', '获赞数'],
    sData: [],
    loading: true,
    error: null
  })

  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    loading: true,
    data: null,
    error: null
  })

  // 编辑表单状态
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      // 更新状态为加载中
      setUserInfo(prev => ({ ...prev, loading: true, error: null }))
      setUserStatsChart(prev => ({ ...prev, loading: true, error: null }))
      
      const res = await getUserStatsAPI()
      setUserInfo({
        loading: false,
        data: res.data,
        error: null
      })
      
      // 更新用户统计图表数据
      if (res.data) {
        setUserStatsChart({
          xData: ['文章数', '关注数', '粉丝数', '获赞数'],
          sData: [
            res.data.art_count,
            res.data.follow_count,
            res.data.fans_count,
            res.data.like_count
          ],
          loading: false,
          error: null
        })
        
        // 初始化表单数据
        form.setFieldsValue({
          name: res.data.name,
          gender: res.data.gender || 0,
          birthday: res.data.birthday ? new Date(res.data.birthday) : null,
          real_name: res.data.real_name || '',
          intro: res.data.intro || ''
        })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      setUserInfo({
        loading: false,
        data: null,
        error: '获取用户信息失败'
      })
      setUserStatsChart({
        xData: ['文章数', '关注数', '粉丝数', '获赞数'],
        sData: [],
        loading: false,
        error: '获取用户统计数据失败'
      })
    }
  }

  // 更新用户资料
  const updateUserProfile = async (values) => {
    try {
      setSubmitting(true)
      
      // 准备请求数据
      const requestData = {
        name: values.name,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
        real_name: values.real_name,
        intro: values.intro
      }
      
      // 调用API更新用户资料
      await request({
        url: '/user/profile',
        method: 'PATCH',
        data: requestData
      })
      
      message.success('用户资料更新成功')
      setIsEditing(false)
      // 重新获取用户信息
      fetchUserInfo()
    } catch (error) {
      console.error('更新用户资料失败:', error)
      message.error('更新用户资料失败')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, []) // 依赖项为空数组，因为fetchUserInfo只在组件挂载时调用一次

  // 渲染加载状态
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>数据加载中...</p>
    </div>
  )

  // 渲染错误状态
  const renderError = (error, retryFn) => (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={retryFn} className="retry-button">
        重试
      </button>
    </div>
  )

  return (
    <div className="home-container">
      <h1 className="home-title">用户资料展示</h1>
      
      {/* 用户信息卡片 */}
      <div className="user-info-card">
        {userInfo.loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>加载用户信息中...</p>
          </div>
        ) : userInfo.error ? (
          renderError(userInfo.error, fetchUserInfo)
        ) : userInfo.data ? (
          <div className="user-info-content">
            <div className="user-avatar-section">
              <img 
                src={userInfo.data.photo || 'https://via.placeholder.com/100'} 
                alt={userInfo.data.name} 
                className="user-avatar"
              />
              <div className="user-basic-info">
                <h2 className="user-name">{userInfo.data.name}</h2>
                {/* 移除自我介绍展示 */}
              </div>
            </div>
            
            <div className="user-stats-grid">
              <div className="stat-item">
                <span className="stat-value">{userInfo.data.art_count}</span>
                <span className="stat-label">文章数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userInfo.data.follow_count}</span>
                <span className="stat-label">关注数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userInfo.data.fans_count}</span>
                <span className="stat-label">粉丝数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userInfo.data.like_count}</span>
                <span className="stat-label">获赞数</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* 主要内容区域：左侧图表，右侧编辑模块 */}
      <div className="main-content-wrapper">
        {/* 用户统计图表 */}
        <div className="chart-section">
          <div className="chart-card">
            <h2 className="chart-title">用户数据统计</h2>
            {userStatsChart.loading ? (
              renderLoading()
            ) : userStatsChart.error ? (
              renderError(userStatsChart.error, fetchUserInfo)
            ) : (
              <BarChart
                xData={userStatsChart.xData}
                sData={userStatsChart.sData}
                style={{ width: '100%', height: '400px' }} />
            )}
          </div>
        </div>
        
        {/* 用户资料编辑模块 */}
        <div className="edit-section">
          <div className="edit-card">
            <div className="edit-card-header">
              <h2 className="edit-title">{isEditing ? '编辑用户资料' : '用户资料管理'}</h2>
              <Button 
                type="primary" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '取消编辑' : '编辑资料'}
              </Button>
            </div>
            
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={updateUserProfile}
              >
                <Form.Item
                  name="name"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
                
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Radio.Group>
                    <Radio value={0}>男</Radio>
                    <Radio value={1}>女</Radio>
                  </Radio.Group>
                </Form.Item>
                
                <Form.Item
                  name="birthday"
                  label="生日"
                  rules={[{ required: true, message: '请选择生日' }]}
                >
                  <DatePicker 
                    placeholder="请选择生日"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                
                <Form.Item
                  name="real_name"
                  label="真实姓名"
                  rules={[{ required: true, message: '请输入真实姓名' }]}
                >
                  <Input placeholder="请输入真实姓名" />
                </Form.Item>
                
                <Form.Item
                  name="intro"
                  label="个人介绍"
                  rules={[{ required: true, message: '请输入个人介绍' }]}
                >
                  <ReactQuill
                    theme="snow"
                    placeholder="请输入个人介绍"
                    style={{ height: '200px' }}
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={submitting}
                  >
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              userInfo.data ? (
                <div className="user-profile-display">
                  <div className="profile-item">
                    <span className="profile-label">用户名：</span>
                    <span className="profile-value">{userInfo.data.name}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">性别：</span>
                    <span className="profile-value">{userInfo.data.gender === 0 ? '男' : userInfo.data.gender === 1 ? '女' : '未知'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">生日：</span>
                    <span className="profile-value">{userInfo.data.birthday || '未设置'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">真实姓名：</span>
                    <span className="profile-value">{userInfo.data.real_name || '未设置'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">个人介绍：</span>
                    <div 
                      className="profile-intro" 
                      dangerouslySetInnerHTML={{ 
                        __html: userInfo.data.intro || '暂无个人介绍' 
                      }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="empty-profile">
                  <p>暂无用户资料信息</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div >
  )
})

export default Home