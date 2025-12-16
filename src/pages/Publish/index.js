import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import { createArticleAPI } from '@/apis/publish'
import { useChannel } from '@/hooks/useChannel'
// 富文本编辑器
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useState, useRef } from 'react'

const { Option } = Select

const Publish = () => {
  const { channelsList } = useChannel();

  // 提交表单数据
  const [form] = Form.useForm();
  const onFinish = async (formData) => {
    // 适配需求数据
    formData.cover = {
      type: imageType,
    }
    if(formData.cover.type){
      formData.cover.images = imageList.map(item => item.response.data.url);  
    } else formData.cover.images = []
    
    // 调用API接口
    const res = await createArticleAPI(formData);
    if(res.message === 'OK') {
      message.success('文章创建成功！');
      // 重置表单数据和图片相关状态
      form.resetFields(); 
      setImageType(1);
      setImageList([]);
      cacheImageList.current = []
    }
  }

  // 上传图片
  const cacheImageList = useRef([])
  const [imageList, setImageList] = useState([])
  const onUploadChange = (info) => {
    setImageList(info.fileList)
    cacheImageList.current = info.fileList
  }

  // 图片模式改变
  const [imageType, setImageType] = useState(1)
  const onTypeChange = (e) => {
    setImageType(e.target.value)    
  }
  // 图片模式改变，需要查看图片是否超过数量
  useEffect(() => {
    if(imageType === 1) {
      const imgList = cacheImageList.current[0] ? [cacheImageList.current[0]] : []
      setImageList(imgList)
    } else if (imageType === 3) {
      setImageList(cacheImageList.current)
    }
  }, [imageType])

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
          form={form}
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
          <Form.Item label="封面">
          <Form.Item name="type">
              <Radio.Group onChange={onTypeChange} initialValues={1}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            { imageType > 0 && 
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                onChange={onUploadChange}
                maxCount={imageType}
                multiple={imageType > 1}
                fileList={imageList}
              >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
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