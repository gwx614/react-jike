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
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import { createArticleAPI, updateArticleAPI } from '@/apis/publish'
import { useChannel } from '@/hooks/useChannel'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useState, useRef } from 'react'
import { getDetailAPI } from '@/apis/article'

const { Option } = Select

const Publish = () => {
  const navigate = useNavigate();
  const { channelsList } = useChannel();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const isEditMode = !!articleId; // 判断是编辑还是创建

  // 提交表单数据
  const onFinish = async (formData) => {
    try {
      // 验证图片数量：三图模式下必须上传3张图片
      if (imageType === 3 && imageList.length < 3) {
        message.error('三图模式下必须上传3张图片');
        return;
      }
      
      // 适配封面数据
      formData.cover = {
        type: imageType,
        images: imageType > 0 
          ? imageList.map(item => item.response?.data?.url || item.url).filter(Boolean) // 安全处理URL
          : []
      };

      let res;
      if (isEditMode) {
        // 编辑模式：调用更新接口
        res = await updateArticleAPI(articleId, formData);
        message.success('文章更新成功！');
        navigate('/article');
      } else {
        // 创建模式：调用创建接口
        res = await createArticleAPI(formData);
        message.success('文章创建成功！');
      }

      if (res.message === 'OK') {
        if (!isEditMode) {
          form.resetFields(); 
          setImageType(1);
          setImageList([]);
          cacheImageList.current = [];
        }
      }
    } catch (error) {
      message.error(isEditMode ? '更新失败' : '创建失败');
    }
  }

  // 上传图片相关状态
  const cacheImageList = useRef([]);
  const [imageList, setImageList] = useState([]);
  const [imageType, setImageType] = useState(1);

  const onUploadChange = (info) => {
    setImageList(info.fileList);
    cacheImageList.current = info.fileList;
  }

  const onTypeChange = (e) => {
    setImageType(Number(e.target.value));
  }

  // 图片模式改变处理
  useEffect(() => {
    if (imageType === 1) {
      const imgList = cacheImageList.current[0] ? [cacheImageList.current[0]] : [];
      setImageList(imgList);
    } else if (imageType === 3) {
      setImageList([...cacheImageList.current]); 
    } else if (imageType === 0) {
      setImageList([]);
    }
  }, [imageType]);

  // 数据回显 - 编辑模式
  useEffect(() => {
    const getArticle = async () => {
      try {
        const res = await getDetailAPI(articleId);
        const { cover, ...formValue } = res.data;
        
        // 1. 回填封面相关状态
        setImageType(cover.type);
        
        // 2. 转换图片数据格式，兼容编辑和上传
        if (cover.images && cover.images.length > 0) {
          const formattedImages = cover.images.map((url) => ({url: url}));
          setImageList(formattedImages);
          cacheImageList.current = formattedImages;
        }
        
        // 3. 等待Form组件渲染完成后再设置表单数据
        setTimeout(() => {
          form.setFieldsValue({
            ...formValue,
            type: cover.type
          });
        }, 0);
      } catch (error) {
        message.error('获取文章详情失败');
      }
    };

    if (articleId) {
      getArticle();
    }
  }, [articleId, form]);

  // 处理ReactQuill变化
  const handleContentChange = (value) => {
    form.setFieldValue('content', value);
  };

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: isEditMode ? '编辑文章' : '发布文章' },
          ]} />
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
              {channelsList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="封面" className="cover-section">
            <Form.Item name="type" noStyle>
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            
            <div className="cover-upload-area">
              {imageType > 0 && (
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList
                  action="http://geek.itheima.net/v1_0/upload"
                  onChange={onUploadChange}
                  maxCount={imageType}
                  multiple={imageType > 1}
                  fileList={imageList}
                  className="publish-uploader"
                >
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                  </div>
                </Upload>
              )}
            </div>
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
              value={form.getFieldValue('content') || ''}
              onChange={handleContentChange}
            />
          </Form.Item>
          
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {isEditMode ? '更新文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish;