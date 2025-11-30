import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="blog-footer">
      <Container>
        <Row>
          <Col md={6}>
            <h5>博客系统</h5>
            <p>一个基于Django和React的现代化博客系统，分享知识，记录生活。</p>
          </Col>
          <Col md={3}>
            <h5>快速链接</h5>
            <ul className="list-unstyled">
              <li><a href="/posts" className="text-white">文章列表</a></li>
              <li><a href="/categories" className="text-white">分类</a></li>
              <li><a href="/tags" className="text-white">标签</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>关于</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-white">关于我们</a></li>
              <li><a href="/contact" className="text-white">联系我们</a></li>
              <li><a href="/privacy" className="text-white">隐私政策</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-white" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {currentYear} 博客系统. 保留所有权利.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;