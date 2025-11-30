# 博客系统

一个基于Django REST Framework和React的现代化博客系统，支持用户管理、文章发布、评论互动等功能。

## 技术栈

### 后端
- **Django 4.2.7** - Python Web框架
- **Django REST Framework 3.14.0** - RESTful API框架
- **MySQL** - 数据库
- **JWT** - 用户认证
- **django-cors-headers** - CORS支持
- **django-filter** - 查询过滤

### 前端
- **React 18.2.0** - 前端框架
- **React Router 6.8.0** - 路由管理
- **Bootstrap 5.2.3** - UI框架
- **React Bootstrap 2.7.0** - React组件库
- **Axios 1.3.0** - HTTP客户端
- **React Markdown 8.0.5** - Markdown渲染

## 功能特性

### 用户功能
- ✅ 用户注册和登录
- ✅ 个人资料管理
- ✅ 头像上传
- ✅ JWT Token认证

### 文章功能
- ✅ 文章创建、编辑、删除
- ✅ 文章分类和标签
- ✅ Markdown编辑器支持
- ✅ 文章搜索和筛选
- ✅ 推荐文章功能
- ✅ 浏览量统计

### 互动功能
- ✅ 评论系统（支持嵌套回复）
- ✅ 文章点赞
- ✅ 用户关注（可扩展）

### 管理功能
- ✅ Django Admin后台管理
- ✅ 内容审核
- ✅ 用户管理
- ✅ 数据统计

## 项目结构

```
blog_web/
├── backend/                 # Django后端
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── blog_backend/        # 项目配置
│   └── apps/               # 应用模块
│       ├── users/          # 用户应用
│       └── blog/           # 博客应用
├── frontend/               # React前端
│   ├── public/
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── contexts/      # Context
│   │   └── services/      # API服务
│   └── package.json
└── README.md
```

## 快速开始

### 环境要求
- Python 3.8+
- Node.js 14+
- MySQL 5.7+

### 快速启动（推荐）

```bash
# 一键启动前后端服务（无需虚拟环境）
python run.py
```

### 手动启动

#### 1. 后端设置

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 创建数据库
mysql -u root -p
CREATE DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 运行迁移
python manage.py makemigrations
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动后端服务
python manage.py runserver
```

#### 2. 前端设置

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm start
```

#### 3. 访问应用

- 前端应用：http://localhost:3000
- 后端API：http://localhost:8000/api/
- 管理后台：http://localhost:8000/admin/

## 部署指南

### 生产环境部署

#### 后端部署（使用Gunicorn + Nginx）

1. 安装生产环境依赖：
```bash
pip install gunicorn
```

2. 创建Gunicorn配置文件：
```bash
# gunicorn.conf.py
bind = "127.0.0.1:8000"
workers = 3
max_requests = 1000
max_requests_jitter = 100
timeout = 30
```

3. 启动Gunicorn：
```bash
gunicorn blog_backend.wsgi:application -c gunicorn.conf.py
```

4. 配置Nginx反向代理：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 前端部署

1. 构建生产版本：
```bash
npm run build
```

2. 使用Nginx或Apache托管静态文件。

### Docker部署

可以使用Docker Compose进行一键部署：

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: blog_db
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    depends_on:
      - db
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_PASSWORD=password

  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  mysql_data:
```

## API文档

### 认证接口
- `POST /api/auth/register/` - 用户注册
- `POST /api/auth/login/` - 用户登录
- `GET /api/auth/profile/` - 获取用户信息

### 文章接口
- `GET /api/blog/posts/` - 获取文章列表
- `GET /api/blog/posts/<slug>/` - 获取文章详情
- `POST /api/blog/posts/create/` - 创建文章
- `PUT /api/blog/posts/<slug>/edit/` - 更新文章

### 评论接口
- `GET /api/blog/comments/` - 获取评论列表
- `POST /api/blog/comments/` - 创建评论

更多详细信息请参考：
- [后端README](./backend/README.md)
- [前端README](./frontend/README.md)

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：your-email@example.com
- GitHub Issues：[提交Issue](https://github.com/your-username/blog_web/issues)

## 更新日志

### v1.0.0 (2024-01-01)
- 基础功能实现
- 用户认证系统
- 文章管理功能
- 评论系统
- 响应式前端界面