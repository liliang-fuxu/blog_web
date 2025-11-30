import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

const PostCard = ({ post, showFullContent = false }) => {
  return (
    <Card className="mb-4">
      {post.featured_image && (
        <Card.Img 
          variant="top" 
          src={post.featured_image} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title>
            <Link to={`/posts/${post.slug}`} className="post-title text-decoration-none">
              {post.title}
            </Link>
            {post.is_featured && (
              <Badge bg="warning" text="dark" className="ms-2">
                推荐
              </Badge>
            )}
          </Card.Title>
        </div>
        
        <div className="post-meta mb-3">
          <small className="text-muted">
            作者: {post.author?.first_name || post.author?.username} | 
            发布时间: {moment(post.published_at || post.created_at).format('YYYY-MM-DD')} | 
            浏览: {post.views_count} | 
            点赞: {post.likes_count}
          </small>
        </div>

        {post.category && (
          <div className="mb-2">
            <Badge bg="secondary" className="me-2">
              {post.category.name}
            </Badge>
          </div>
        )}

        {showFullContent ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <Card.Text>
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </Card.Text>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3">
            {post.tags.map(tag => (
              <span key={tag.id} className="tag">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3">
          <Button as={Link} to={`/posts/${post.slug}`} variant="primary">
            阅读全文
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;