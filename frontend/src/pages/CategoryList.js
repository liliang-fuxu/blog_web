import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <h2 className="mb-4">文章分类</h2>
      
      {categories.length > 0 ? (
        <Row>
          {categories.map(category => (
            <Col md={4} key={category.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <Link 
                      to={`/posts?category=${category.id}`}
                      className="text-decoration-none"
                    >
                      {category.name}
                    </Link>
                  </Card.Title>
                  {category.description && (
                    <Card.Text>{category.description}</Card.Text>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg="secondary">
                      {category.posts_count} 篇文章
                    </Badge>
                    <small className="text-muted">
                      创建于 {new Date(category.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          暂无分类。
        </Alert>
      )}
    </Container>
  );
};

export default CategoryList;