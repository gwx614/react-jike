import { useRef, useEffect, useCallback, memo } from 'react'
import * as echarts from 'echarts'

const BarChart = ({ xData, sData, style = { width: '400px', height: '300px' } }) => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  // 初始化图表实例
  const initChart = useCallback(() => {
    if (!chartRef.current) return
    
    // 复用图表实例
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current)
    }
    
    return chartInstanceRef.current
  }, [])

  // 更新图表数据
  const updateChart = useCallback((chartInstance) => {
    if (!chartInstance) return
    
    const option = {
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: sData,
          type: 'bar'
        }
      ]
    }
    
    chartInstance.setOption(option)
  }, [xData, sData])

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize()
    }
  }, [])

  useEffect(() => {
    const chartInstance = initChart()
    updateChart(chartInstance)

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize)

    // 组件卸载时清理
    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    }
  }, [initChart, updateChart, handleResize])

  return <div ref={chartRef} style={style}></div>
}

// 使用React.memo优化组件渲染
const MemoizedBarChart = memo(BarChart)

export { MemoizedBarChart as BarChart }