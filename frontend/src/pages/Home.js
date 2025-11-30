import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes, popularRes] = await Promise.all([
          postAPI.getFeaturedPosts(),
          postAPI.getRecentPosts(),
          postAPI.getPopularPosts()
        ]);
        
        setFeaturedPosts(featuredRes.data);
        setRecentPosts(recentRes.data);
        setPopularPosts(popularRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {/* Hero Section */}
      <div className="blog-header text-center mb-5">
        <h1 className="display-4">欢迎来到我的博客</h1>
        <p className="lead">分享知识，记录生活，传递价值</p>
      </div>

      <Row>
        {/* 主要内容区域 */}
        <Col md={8}>
          {/* 推荐文章 */}
          {featuredPosts.length > 0 && (
            <section className="mb-5">
              <h3 className="mb-4">推荐文章</h3>
              <Row>
                {featuredPosts.map(post => (
                  <Col md={6} key={post.id} className="mb-4">
                    <PostCard post={post} />
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* 最新文章 */}
          <section className="mb-5">
            <h3 className="mb-4">最新文章</h3>
            {recentPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {recentPosts.length === 0 && (
              <p>暂无文章。</p>
            )}
          </section>
        </Col>

        {/* 侧边栏 */}
        <Col md={4}>
          {/* 热门文章 */}
          {popularPosts.length > 0 && (
            <div className="sidebar-widget">
              <h4 className="mb-3">热门文章</h4>
              {popularPosts.slice(0, 5).map(post => (
                <div key={post.id} className="mb-3">
                  <h6>
                    <Link to={`/posts/${post.slug}`} className="text-decoration-none">
                      {post.title}
                    </Link>
                  </h6>
                  <small className="text-muted">
                    浏览: {post.views_count}
                  </small>
                </div>
              ))}
            </div>
          )}

          {/* 快速链接 */}
          <div className="sidebar-widget">
            <h4 className="mb-3">快速链接</h4>
            <div className="d-grid gap-2">
              <Link to="/posts" className="btn btn-outline-primary btn-sm">
                所有文章
              </Link>
              <Link to="/categories" className="btn btn-outline-primary btn-sm">
                文章分类
              </Link>
              <Link to="/tags" className="btn btn-outline-primary btn-sm">
                文章标签
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;