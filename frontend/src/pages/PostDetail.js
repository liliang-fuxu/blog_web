import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [parentComment, setParentComment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postAPI.getPost(slug);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setMessage('请先登录后点赞');
      return;
    }

    try {
      await postAPI.likePost(slug);
      setPost(prev => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      setMessage('操作失败，请重试');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('请先登录后评论');
      return;
    }

    setSubmitting(true);
    try {
      const response = await commentAPI.createComment({
        post: post.id,
        parent: parentComment,
        content: commentContent
      });
      
      setComments(prev => [...prev, response.data]);
      setCommentContent('');
      setParentComment(null);
      setMessage('评论发表成功！');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage('评论发表失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    setParentComment(comment.id);
    setCommentContent(`@${comment.author.username} `);
  };

  if (loading) {
    return <LoadingSpinner />;
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
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h1 className="mb-3">{post.title}</h1>
              
              <div className="post-meta mb-4">
                <span className="me-3">
                  作者: <strong>{post.author?.first_name || post.author?.username}</strong>
                </span>
                <span className="me-3">
                  发布时间: {moment(post.published_at || post.created_at).format('YYYY-MM-DD HH:mm')}
                </span>
                <span className="me-3">
                  浏览: {post.views_count}
                </span>
                <span className="me-3">
                  点赞: {post.likes_count}
                </span>
              </div>

              {post.featured_image && (
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="img-fluid mb-4 rounded"
                />
              )}

              {post.category && (
                <div className="mb-3">
                  <span className="badge bg-secondary">{post.category.name}</span>
                </div>
              )}

              <div className="post-content mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  {post.tags.map(tag => (
                    <span key={tag.id} className="tag">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="d-flex gap-2 mb-4">
                <Button 
                  variant={post.is_liked ? "danger" : "outline-danger"}
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                >
                  {post.is_liked ? '❤️ 已点赞' : '🤍 点赞'} ({post.likes_count})
                </Button>
              </div>

              {/* 评论区 */}
              <hr />
              <h4>评论 ({comments.length})</h4>

              {/* 评论表单 */}
              {isAuthenticated && (
                <Card className="mb-4">
                  <Card.Body>
                    <h6>
                      {parentComment ? '回复评论' : '发表评论'}
                      {parentComment && (
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => setParentComment(null)}
                        >
                          取消回复
                        </Button>
                      )}
                    </h6>
                    <Form onSubmit={handleCommentSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="写下你的评论..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? '发表中...' : '发表评论'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* 评论列表 */}
              <div className="comments-section">
                {comments.map(comment => (
                  <Card key={comment.id} className="mb-3">
                    <Card.Body>
                      <div className="author-info">
                        <strong>{comment.author?.username}</strong>
                        <small className="text-muted ms-2">
                          {moment(comment.created_at).fromNow()}
                        </small>
                      </div>
                      <p className="mt-2 mb-2">{comment.content}</p>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => handleReply(comment)}
                        disabled={!isAuthenticated}
                      >
                        回复
                      </Button>
                      
                      {/* 回复评论 */}
                      {comment.replies && comment.replies.map(reply => (
                        <div key={reply.id} className="comment ms-4 mt-3">
                          <div className="author-info">
                            <strong>{reply.author?.username}</strong>
                            <small className="text-muted ms-2">
                              {moment(reply.created_at).fromNow()}
                            </small>
                          </div>
                          <p className="mt-2 mb-2">{reply.content}</p>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                ))}

                {comments.length === 0 && (
                  <p className="text-muted">暂无评论，快来抢沙发吧！</p>
                )}
              </div>
            </Card.Body>
          </Card>

          {message && (
            <Alert 
              variant={message.includes('失败') || message.includes('错误') ? 'danger' : 'success'}
              onClose={() => setMessage('')}
              dismissible
            >
              {message}
            </Alert>
          )}
        </Col>

        <Col md={4}>
          {/* 作者信息 */}
          <Card className="mb-4">
            <Card.Body>
              <h5>作者信息</h5>
              <div className="author-info">
                {post.author?.avatar && (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.username}
                    className="author-avatar"
                  />
                )}
                <div>
                  <strong>{post.author?.first_name || post.author?.username}</strong>
                  {post.author?.bio && <p className="mb-0">{post.author.bio}</p>}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* 相关操作 */}
          <Card>
            <Card.Body>
              <h5>快速导航</h5>
              <div className="d-grid gap-2">
                <Button as={Link} to="/posts" variant="outline-secondary" size="sm">
                  返回文章列表
                </Button>
                {isAuthenticated && post.author?.id === JSON.parse(localStorage.getItem('user'))?.id && (
                  <Button as={Link} to={`/edit-post/${slug}`} variant="outline-primary" size="sm">
                    编辑文章
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;