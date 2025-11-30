#!/bin/bash

echo "=== 清理项目并重新提交 ==="

# 清理前端缓存和大文件
echo "1. 清理前端缓存..."
cd frontend
rm -rf node_modules/.cache
rm -rf build
rm -rf .next
rm -rf .nuxt
rm -rf .vuepress
rm -rf dist

# 删除node_modules（如果太大）
if [ -d "node_modules" ]; then
    echo "删除 node_modules 目录..."
    rm -rf node_modules
fi

cd ..

# 清理后端缓存
echo "2. 清理后端缓存..."
cd backend
rm -rf __pycache__
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete

# 删除数据库文件
if [ -f "db.sqlite3" ]; then
    echo "备份数据库文件..."
    mv db.sqlite3 db.sqlite3.backup
fi

# 删除静态文件和媒体文件
rm -rf staticfiles
rm -rf media

cd ..

# 重新添加和提交
echo "3. 重新添加文件..."
git add .
git status

echo "4. 提交更改..."
git commit -m "清理大文件和缓存

- 删除node_modules/.cache缓存
- 删除Python缓存文件
- 备份数据库文件
- 删除构建输出文件"

echo "5. 推送到远程仓库..."
git push origin main

echo "=== 完成！==="