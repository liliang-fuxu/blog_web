import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access', access);
          original.headers.Authorization = `Bearer ${access}`;
          return api(original);
        }
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (userData) => api.put('/auth/profile/', userData),
  getUsers: () => api.get('/auth/users/'),
  getUser: (id) => api.get(`/auth/users/${id}/`),
};

// 文章相关API
export const postAPI = {
  getPosts: (params) => api.get('/blog/posts/', { params }),
  getPost: (slug) => api.get(`/blog/posts/${slug}/`),
  createPost: (data) => api.post('/blog/posts/create/', data),
  updatePost: (slug, data) => api.put(`/blog/posts/${slug}/edit/`, data),
  deletePost: (slug) => api.delete(`/blog/posts/${slug}/delete/`),
  getMyPosts: (params) => api.get('/blog/posts/my/', { params }),
  getFeaturedPosts: () => api.get('/blog/posts/featured/'),
  getPopularPosts: () => api.get('/blog/posts/popular/'),
  getRecentPosts: () => api.get('/blog/posts/recent/'),
  likePost: (slug) => api.post(`/blog/posts/${slug}/like/`),
};

// 分类相关API
export const categoryAPI = {
  getCategories: (params) => api.get('/blog/categories/', { params }),
  getCategory: (id) => api.get(`/blog/categories/${id}/`),
  createCategory: (data) => api.post('/blog/categories/', data),
  updateCategory: (id, data) => api.put(`/blog/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/blog/categories/${id}/`),
};

// 标签相关API
export const tagAPI = {
  getTags: (params) => api.get('/blog/tags/', { params }),
  getTag: (id) => api.get(`/blog/tags/${id}/`),
  createTag: (data) => api.post('/blog/tags/', data),
  updateTag: (id, data) => api.put(`/blog/tags/${id}/`, data),
  deleteTag: (id) => api.delete(`/blog/tags/${id}/`),
};

// 评论相关API
export const commentAPI = {
  getComments: (params) => api.get('/blog/comments/', { params }),
  getComment: (id) => api.get(`/blog/comments/${id}/`),
  createComment: (data) => api.post('/blog/comments/', data),
  updateComment: (id, data) => api.put(`/blog/comments/${id}/`, data),
  deleteComment: (id) => api.delete(`/blog/comments/${id}/`),
};

export default api;