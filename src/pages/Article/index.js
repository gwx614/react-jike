import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select,  Table, Tag, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { useChannel } from '@/hooks/useChannel'
import { useEffect, useState } from 'react'
import { getArticleAPI, delArticleAPI } from '@/apis/article'


const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const navigate = useNavigate()
  // 频道数据
  const { channelsList } = useChannel()

  // 准备列数据
  // 审核状态
  const status = {
    1: <Tag color="yellow">审核中</Tag>,
    2: <Tag color="green">审核通过</Tag>,
    3: <Tag color="red">审核失败</Tag>
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => status[data]
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button 
            type="primary" 
            shape="circle" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/publish?id=${data.id}`)} />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  // 准备表格body数据
  const [params, setParams] = useState({
    status: '',
    channel_id: '',
    begin_pubdate: '',
    end_pubdate: '',
    page: 1,
    per_page: 10
  })
  const [list, setList] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    async function getList() {
      try {
        setLoading(true)
        const res = await getArticleAPI(params);
        setCount(res.data.total_count)
        setList(res.data.results);
      } catch (error) {
        console.error('获取文章列表失败:', error)
      } finally {
        setLoading(false)
      }
    }
    getList();
  }, [params])

  // 分页数据改变，重新获取表格数据
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // 筛选条件改变，重新渲染
  const onFinish = (formValue) => {
    setParams({
      ...params,
      status: formValue.status,
      channel_id: formValue.channel_id,
      begin_pubdate: formValue.date?.[0]?.format('YYYY-MM-DD') || '',
      end_pubdate: formValue.date?.[1]?.format('YYYY-MM-DD') || '',
      page: 1 // 重置到第一页
    })
  }

  // 删除文章功能
  async function delArticle(data) {
    await delArticleAPI(data.id);
    setParams({
      ...params,
      page: params.page
    })
  }

  return (
    
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={1}>审核中</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              { channelsList.map(item => <Option value={item.id}>{item.name}</Option>) }
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={list} 
          loading={loading}
          pagination={{
            current: params.page,
            pageSize: params.per_page,
            onChange: pageChange,
            total: count
          }} 
        />
      </Card>
    </div>
  )
}

export default Article