
import { useState, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserInfo as fetchUserInfoAction } from '@/store/modules/user'
import { BarChart } from './components/BarChart'
import './index.scss'
import { getUserStatsAPI, updateUserPhotoAPI } from '@/apis/user'
import { Form, Input, Button, Radio, DatePicker, message, Upload } from 'antd'
import { request } from '@/utils'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { UploadOutlined } from '@ant-design/icons'

const Home = memo(() => {
  const dispatch = useDispatch()
  // 从Redux store获取用户信息
  const userInfoFromStore = useSelector(state => state.user.userInfo)
  
  // 用户统计图表状态
  const [userStatsChart, setUserStatsChart] = useState({
    loading: true,
    error: null,
    sData: []
  })

  // 编辑表单状态
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // 始终创建form实例，确保表单数据正确初始化
  const [form] = Form.useForm()

  // 获取用户统计数据
  const fetchUserStats = async () => {
    try {
      setUserStatsChart(prev => ({ ...prev, loading: true, error: null }))
      
      // 获取用户统计数据
      const res = await getUserStatsAPI()
      
      // 更新用户统计图表数据
      if (res.data) {
        setUserStatsChart({
          loading: false,
          error: null,
          sData: [
            res.data.art_count,
            res.data.follow_count,
            res.data.fans_count,
            res.data.like_count
          ]
        })
        
        // 初始化表单数据
        form.setFieldsValue({
          name: userInfoFromStore.name || res.data.name,
          gender: userInfoFromStore.gender || res.data.gender || 0,
          birthday: userInfoFromStore.birthday ? new Date(userInfoFromStore.birthday) : res.data.birthday ? new Date(res.data.birthday) : null,
          real_name: userInfoFromStore.real_name || res.data.real_name || '',
          intro: userInfoFromStore.intro || res.data.intro || ''
        })
      }
    } catch (error) {
      console.error('获取用户统计数据失败:', error)
      setUserStatsChart({
        loading: false,
        error: '获取用户统计数据失败',
        sData: []
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
      // 重新获取用户信息和统计数据
      dispatch(fetchUserInfoAction())
      fetchUserStats()
    } catch (error) {
      console.error('更新用户资料失败:', error)
      message.error('更新用户资料失败')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // 从Redux store获取用户基本信息
    dispatch(fetchUserInfoAction())
    // 获取用户统计数据
    fetchUserStats()
  }, [dispatch])

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
        <div className="user-info-content">
          <div className="user-avatar-section">
            <div className="avatar-container">
              <img 
                src={userInfoFromStore.photo || 'https://via.placeholder.com/100'} 
                alt={userInfoFromStore.name || '用户'} 
                className="user-avatar"
              />
              <Upload
                name="photo"
                showUploadList={false}
                beforeUpload={async (file) => {
                  try {
                    await updateUserPhotoAPI(file);
                    message.success('头像上传成功');
                    // 重新获取用户信息
                    dispatch(fetchUserInfoAction());
                  } catch (error) {
                    console.error('头像上传失败:', error);
                    message.error('头像上传失败');
                  }
                  return false; // 阻止自动上传
                }}
              >
                <Button icon={<UploadOutlined />} className="avatar-upload-btn">
                  更换头像
                </Button>
              </Upload>
            </div>
            <div className="user-basic-info">
              <h2 className="user-name">{userInfoFromStore.name || '未设置'}</h2>
            </div>
          </div>
          
          <div className="user-stats-grid">
            <div className="stat-item">
              <span className="stat-value">{userStatsChart.sData[0] || 0}</span>
              <span className="stat-label">文章数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStatsChart.sData[1] || 0}</span>
              <span className="stat-label">关注数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStatsChart.sData[2] || 0}</span>
              <span className="stat-label">粉丝数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStatsChart.sData[3] || 0}</span>
              <span className="stat-label">获赞数</span>
            </div>
          </div>
        </div>
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
              renderError(userStatsChart.error, fetchUserStats)
            ) : (
              <BarChart
                xData={['文章数', '关注数', '粉丝数', '获赞数']}
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
            
            {/* 始终渲染Form组件，确保form实例连接到Form元素，避免警告 */}
            <Form
              form={form}
              layout="vertical"
              onFinish={updateUserProfile}
            >
              {isEditing ? (
                <>
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
                </>
              ) : (
                <div className="user-profile-display">
                  <div className="profile-item">
                    <span className="profile-label">用户名：</span>
                    <span className="profile-value">{userInfoFromStore.name || '未设置'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">性别：</span>
                    <span className="profile-value">{userInfoFromStore.gender === 0 ? '男' : userInfoFromStore.gender === 1 ? '女' : '未知'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">生日：</span>
                    <span className="profile-value">{userInfoFromStore.birthday || '未设置'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">真实姓名：</span>
                    <span className="profile-value">{userInfoFromStore.real_name || '未设置'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">个人介绍：</span>
                    <div 
                      className="profile-intro" 
                      dangerouslySetInnerHTML={{ 
                        __html: userInfoFromStore.intro || '暂无个人介绍' 
                      }} 
                    />
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div >
  )
})

export default Home