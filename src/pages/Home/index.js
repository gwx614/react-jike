
import { useState, useEffect, memo } from 'react'
import { BarChart } from './components/BarChart'
import './index.scss'
import { getUserStatsAPI } from '@/apis/user'

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

  useEffect(() => {
    fetchUserInfo()
  }, [])

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
                <div 
                  className="user-intro" 
                  dangerouslySetInnerHTML={{ 
                    __html: userInfo.data.intro || '暂无个人介绍' 
                  }} 
                />
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
      
      {/* 用户统计图表 */}
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
    </div >
  )
})

export default Home