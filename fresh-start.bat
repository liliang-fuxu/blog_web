@echo off
echo === 完全重新初始化Git仓库 ===

:: 1. 备份重要文件
echo 1. 备份当前项目...
copy backend\.env.example backend\.env.backup-config 2>nul
copy README.md README.backup.md 2>nul

:: 2. 完全删除.git目录
echo 2. 删除旧的Git历史...
if exist ".git" rmdir /s /q ".git"

:: 3. 清理所有缓存和临时文件
echo 3. 清理缓存文件...
if exist "frontend\node_modules\.cache" rmdir /s /q "frontend\node_modules\.cache"
if exist "frontend\build" rmdir /s /q "frontend\build"
if exist "frontend\dist" rmdir /s /q "frontend\dist"

cd backend
if exist "__pycache__" for /d %%d in (__pycache__) do rmdir /s /q "%%d"
for /r %%f in (*.pyc) do del "%%f" 2>nul
for /r %%f in (*.pyo) do del "%%f" 2>nul

if exist "staticfiles" rmdir /s /q "staticfiles"
if exist "media" rmdir /s /q "media"
if exist "db.sqlite3" del "db.sqlite3" 2>nul

cd ..

:: 4. 重新初始化Git
echo 4. 重新初始化Git仓库...
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

:: 5. 重新添加文件（现在gitignore会保护）
echo 5. 添加项目文件...
git add .
git status

:: 6. 提交
echo 6. 创建初始提交...
git commit -m "博客系统v1.0: Django + React全栈博客系统

功能特性:
- Django REST Framework 后端API
- React + Bootstrap 前端界面
- 用户认证和权限管理
- 文章CRUD和分类系统
- 评论和点赞功能
- 响应式设计

技术栈:
- Django 4.2, DRF, MySQL
- React 18, Bootstrap 5
- JWT认证, CORS支持"

:: 7. 添加远程仓库
echo 7. 连接远程仓库...
git remote add origin git@github.com:liliang-fuxu/blog_web.git

:: 8. 推送
echo 8. 推送到GitHub...
git push -u origin main

echo.
echo === 🎉 博客系统已成功提交到GitHub！===
echo.
echo 下次启动项目:
echo 1. cd frontend && npm install
echo 2. cd ../backend && pip install -r requirements.txt
echo 3. python manage.py migrate
echo 4. python manage.py runserver
echo 5. 在另一个终端: cd frontend && npm start
echo.
pause