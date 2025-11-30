import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Pagination, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { postAPI, categoryAPI, tagAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage,
          category,
          tag,
          search,
        };

        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          postAPI.getPosts(params),
          categoryAPI.getCategories(),
          tagAPI.getTags()
        ]);

        setPosts(postsRes.data.results || postsRes.data);
        setTotalPages(Math.ceil((postsRes.data.count || postsRes.data.length) / 10));
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, category, tag, search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2 className="mb-4">文章列表</h2>
          
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-5">
              <h4>暂无文章</h4>
              <p>没有找到符合条件的文章。</p>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Col>

        <Col md={4}>
          {/* 搜索 */}
          <div className="sidebar-widget">
            <h5 className="mb-3">搜索文章</h5>
            <Form method="get">
              <Form.Control
                type="text"
                placeholder="搜索..."
                name="search"
                defaultValue={search || ''}
                className="mb-2"
              />
              <Button type="submit" variant="primary" size="sm">
                搜索
              </Button>
            </Form>
          </div>

          {/* 分类筛选 */}
          {categories.length > 0 && (
            <div className="sidebar-widget">
              <h5 className="mb-3">分类</h5>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  href="/posts"
                  active={!category}
                >
                  全部分类
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant="outline-secondary"
                    size="sm"
                    href={`/posts?category=${cat.id}`}
                    active={category == cat.id}
                  >
                    {cat.name} ({cat.posts_count})
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 标签筛选 */}
          {tags.length > 0 && (
            <div className="sidebar-widget">
              <h5 className="mb-3">标签</h5>
              <div className="d-flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button
                    key={tag.id}
                    variant="outline-info"
                    size="sm"
                    href={`/posts?tag=${tag.id}`}
                    active={tag == tag.id}
                  >
                    #{tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostList;