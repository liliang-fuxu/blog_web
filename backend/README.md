# 博客系统后端

基于Django REST Framework的博客系统后端API。

## 技术栈

- Django 4.2.7
- Django REST Framework 3.14.0
- MySQL
- JWT认证
- Django CORS Headers
- Django Filter

## 功能特性

- 用户认证与授权（注册、登录、JWT Token）
- 文章管理（CRUD操作）
- 分类和标签管理
- 评论系统（支持嵌套评论）
- 点赞和浏览统计
- 文章搜索和筛选
- 管理后台

## 项目结构

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
└── blog_backend/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── wsgi.py
    └── asgi.py
└── apps/
    ├── __init__.py
    ├── users/          # 用户应用
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   ├── urls.py
    │   └── admin.py
    └── blog/           # 博客应用
        ├── models.py
        ├── views.py
        ├── serializers.py
        ├── urls.py
        └── admin.py
```

## 安装和运行

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

3. 配置MySQL数据库：
```sql
CREATE DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 运行数据库迁移：
```bash
python manage.py makemigrations
python manage.py migrate
```

5. 创建超级用户：
```bash
python manage.py createsuperuser
```

6. 启动开发服务器：
```bash
python manage.py runserver
```

## 快速启动

使用项目根目录的快速启动脚本：
```bash
cd ..
python run.py
```

## API文档

启动服务器后，可以通过以下URL访问：

- API根目录：http://localhost:8000/api/
- 管理后台：http://localhost:8000/admin/
- 认证接口：http://localhost:8000/api/auth/
- 博客接口：http://localhost:8000/api/blog/

### 主要API端点

#### 认证相关
- POST /api/auth/register/ - 用户注册
- POST /api/auth/login/ - 用户登录
- POST /api/auth/logout/ - 用户退出
- GET /api/auth/profile/ - 获取用户信息
- PUT /api/auth/profile/ - 更新用户信息

#### 文章相关
- GET /api/blog/posts/ - 获取文章列表
- GET /api/blog/posts/<slug>/ - 获取文章详情
- POST /api/blog/posts/create/ - 创建文章
- PUT /api/blog/posts/<slug>/edit/ - 更新文章
- DELETE /api/blog/posts/<slug>/delete/ - 删除文章
- POST /api/blog/posts/<slug>/like/ - 点赞文章

#### 分类和标签
- GET /api/blog/categories/ - 获取分类列表
- GET /api/blog/tags/ - 获取标签列表

#### 评论相关
- GET /api/blog/comments/ - 获取评论列表
- POST /api/blog/comments/ - 创建评论
- PUT /api/blog/comments/<id>/ - 更新评论
- DELETE /api/blog/comments/<id>/ - 删除评论

## 开发注意事项

1. 使用JWT进行身份验证
2. 支持CORS跨域请求
3. 包含完整的权限控制
4. 支持文件上传（头像、文章图片）
5. 实现了软删除和草稿功能