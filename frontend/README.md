# 博客系统前端

基于React和Bootstrap的博客系统前端应用。

## 技术栈

- React 18.2.0
- React Router 6.8.0
- React Bootstrap 2.7.0
- Bootstrap 5.2.3
- Axios 1.3.0
- Moment.js 2.29.4
- React Markdown 8.0.5
- React Toastify 9.1.1

## 功能特性

- 响应式设计，支持移动端
- 用户认证（登录、注册、个人资料）
- 文章浏览和管理
- 评论系统
- 搜索和筛选
- 实时通知
- Markdown支持

## 项目结构

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # 组件
│   │   ├── Navigation.js    # 导航栏
│   │   ├── Footer.js        # 页脚
│   │   ├── PostCard.js      # 文章卡片
│   │   └── LoadingSpinner.js # 加载动画
│   ├── pages/               # 页面组件
│   │   ├── Home.js          # 首页
│   │   ├── PostList.js      # 文章列表
│   │   ├── PostDetail.js    # 文章详情
│   │   ├── Login.js         # 登录页
│   │   ├── Register.js      # 注册页
│   │   └── Profile.js       # 个人资料
│   ├── contexts/            # React Context
│   │   └── AuthContext.js   # 认证上下文
│   ├── services/            # API服务
│   │   └── api.js           # API接口
│   ├── App.js               # 主应用组件
│   ├── index.js             # 入口文件
│   └── index.css            # 全局样式
└── package.json
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 构建生产版本：
```bash
npm run build
```

## 页面功能

### 首页 (/)
- 推荐文章展示
- 最新文章列表
- 热门文章侧边栏
- 快速导航链接

### 文章列表 (/posts)
- 文章分页显示
- 分类筛选
- 标签筛选
- 关键词搜索
- 排序功能

### 文章详情 (/posts/:slug)
- 文章内容展示（支持Markdown）
- 作者信息
- 点赞功能
- 评论系统
- 相关推荐

### 用户认证
- 用户注册（/register）
- 用户登录（/login）
- 个人资料管理（/profile）
- JWT Token管理

### 其他功能
- 分类浏览（/categories）
- 标签浏览（/tags）
- 文章创建（/create-post）
- 文章编辑（/edit-post/:slug）

## 环境配置

确保后端API服务器运行在 `http://localhost:8000`，前端通过代理自动转发API请求。

## 开发说明

1. 使用React Router进行路由管理
2. 使用Context API进行全局状态管理
3. 使用Axios进行HTTP请求
4. 使用React Bootstrap进行UI组件开发
5. 使用React Toastify显示通知消息
6. 支持响应式设计，适配移动端设备

## 注意事项

1. 后端API需要配置CORS允许前端域名访问
2. 用户Token存储在localStorage中
3. 支持Token自动刷新机制
4. 所有API请求都会自动携带认证Token