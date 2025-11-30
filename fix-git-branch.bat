@echo off
echo === 修复Git分支问题并重新提交 ===

:: 1. 检查当前分支状态
echo 1. 检查Git分支状态...
git branch -a
echo.

:: 2. 创建并切换到main分支
echo 2. 创建main分支...
git checkout -b main 2>nul || git checkout main

:: 3. 检查是否有远程仓库
echo 3. 检查远程仓库...
git remote -v

:: 4. 如果没有远程仓库，添加它
echo 4. 确保远程仓库存在...
git remote remove origin 2>nul
git remote add origin git@github.com:liliang-fuxu/blog_web.git

:: 5. 添加所有文件
echo 5. 添加项目文件...
git add .
git status

:: 6. 提交
echo 6. 创建提交...
git commit -m "博客系统v1.0: Django + React全栈博客系统

✨ 功能特性:
- Django REST Framework 后端API
- React + Bootstrap 响应式前端
- JWT用户认证和权限管理
- 文章CRUD和分类标签系统
- 评论、点赞和浏览统计
- 管理后台和API文档

🛠️ 技术栈:
- Django 4.2, DRF, MySQL/SQLite
- React 18, Bootstrap 5, Axios
- JWT认证, CORS支持"

:: 7. 推送main分支
echo 7. 推送main分支到GitHub...
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo === 🎉 成功推送到GitHub！===
    echo 您的博客系统现在已成功上传到GitHub
    echo.
    echo 仓库地址: https://github.com/liliang-fuxu/blog_web.git
    echo.
) else (
    echo.
    echo === ❌ 推送失败 ===
    echo 请检查SSH密钥或网络连接
    echo.
    echo 尝试使用HTTPS:
    git remote set-url origin https://github.com/liliang-fuxu/blog_web.git
    git push -u origin main --force
)

pause