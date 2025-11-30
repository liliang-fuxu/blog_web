import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📝 博客系统
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">首页</Nav.Link>
            <Nav.Link as={Link} to="/posts">文章</Nav.Link>
            <Nav.Link as={Link} to="/categories">分类</Nav.Link>
            <Nav.Link as={Link} to="/tags">标签</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown title={user?.username || '用户'} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">
                    个人资料
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/create-post">
                    写文章
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    退出登录
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                  登录
                </Button>
                <Button as={Link} to="/register" variant="light">
                  注册
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;