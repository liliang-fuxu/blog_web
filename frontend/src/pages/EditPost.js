import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { postAPI, categoryAPI, tagAPI } from '../services/api';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    is_featured: false
  });
  const [featuredImage, setFeaturedImage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [postRes, categoriesRes, tagsRes] = await Promise.all([
          postAPI.getPost(slug),
          categoryAPI.getCategories(),
          tagAPI.getTags()
        ]);
        
        const postData = postRes.data;
        
        // 检查是否是作者或管理员
        if (postData.author.id !== user.id && !user.is_staff) {
          toast.error('您没有权限编辑此文章');
          navigate('/posts');
          return;
        }
        
        setPost(postData);
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || '',
          category: postData.category?.id || '',
          tags: postData.tags?.map(tag => tag.id) || [],
          status: postData.status,
          is_featured: postData.is_featured
        });
        
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching post data:', error);
        toast.error('获取文章信息失败');
        navigate('/posts');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [isAuthenticated, slug, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTagsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      tags: selectedOptions
    });
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formData[key].forEach(tagId => {
            formDataToSend.append('tags', tagId);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (featuredImage) {
        formDataToSend.append('featured_image', featuredImage);
      }

      await postAPI.updatePost(slug, formDataToSend);
      toast.success('文章更新成功！');
      navigate(`/posts/${slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-5">加载中...</div>;
  }

  if (!post) {
    return (
      <Container>
        <Alert variant="danger">
          文章不存在或已被删除。
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="mt-4">
            <Card.Body>
              <h2 className="mb-4">编辑文章</h2>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>标题 *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="请输入文章标题"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>摘要</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="文章摘要（可选）"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>分类</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">请选择分类</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>标签</Form.Label>
                      <Form.Select
                        multiple
                        name="tags"
                        value={formData.tags}
                        onChange={handleTagsChange}
                        style={{ height: '100px' }}
                      >
                        {tags.map(tag => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        按住 Ctrl 键可选择多个标签
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>特色图片</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {post.featured_image && (
                    <Form.Text className="text-muted">
                      当前图片: {post.featured_image}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>内容 *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={15}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="请输入文章内容（支持Markdown格式）"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>发布状态</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="draft">草稿</option>
                        <option value="published">发布</option>
                        <option value="archived">归档</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        label="推荐文章"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? '保存中...' : '保存更改'}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => navigate(-1)}
                  >
                    取消
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPost;