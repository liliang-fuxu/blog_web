import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    birth_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        birth_date: user.birth_date || ''
      });
      setPreviewAvatar(user.avatar || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert variant="warning">
          请先 <a href="/login">登录</a> 查看个人资料。
        </Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await authAPI.updateProfile(formDataToSend);
      toast.success('个人资料更新成功！');
      
      // 更新本地用户信息
      // 这里需要更新AuthContext中的用户信息
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Body>
              <h2 className="mb-4">个人资料</h2>
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>头像</Form.Label>
                      <div className="text-center mb-3">
                        {previewAvatar ? (
                          <img 
                            src={previewAvatar} 
                            alt="Avatar"
                            className="rounded-circle"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                            style={{ width: '100px', height: '100px', margin: '0 auto' }}
                          >
                            <span className="text-white fs-3">
                              {user?.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>用户名</Form.Label>
                      <Form.Control
                        type="text"
                        value={user?.username || ''}
                        disabled
                      />
                      <Form.Text className="text-muted">用户名不可修改</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>姓氏</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="请输入姓氏"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>名字</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="请输入名字"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>邮箱</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入邮箱"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>个人简介</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="介绍一下自己..."
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>个人网站</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>所在地</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="城市, 国家"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>生日</Form.Label>
                  <Form.Control
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? '保存中...' : '保存更改'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;