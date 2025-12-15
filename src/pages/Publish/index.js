import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import { fetchChannels, createArticleAPI } from '@/apis/publish'
// 富文本编辑器
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useState } from 'react'

const { Option } = Select

const Publish = () => {

  const [ channelsList, setChannelsList ] = useState([])
  useEffect(() => {
    // 获取文章列表
    const updateChannels = async () => {
      const res = await fetchChannels();
      setChannelsList(res.data.channels);
    }
    updateChannels()
  }, [])

  // 提交表单数据
  const onFinish = async (formData) => {
    const res = await createArticleAPI(formData);
    console.log(res);
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '发布文章' },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              { channelsList.map(item => <Option value={item.id}>{item.name}</Option>) }
            </Select>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish