import React, { useState, useEffect } from 'react';
import { Container, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { tagAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagAPI.getTags();
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <h2 className="mb-4">文章标签</h2>
      
      {tags.length > 0 ? (
        <div className="d-flex flex-wrap gap-3">
          {tags.map(tag => (
            <Link 
              key={tag.id} 
              to={`/posts?tag=${tag.id}`}
              className="text-decoration-none"
            >
              <Badge 
                bg="info" 
                text="white"
                className="p-2 fs-6"
              >
                #{tag.name} ({tag.posts_count})
              </Badge>
            </Link>
          ))}
        </div>
      ) : (
        <Alert variant="info">
          暂无标签。
        </Alert>
      )}
    </Container>
  );
};

export default TagList;