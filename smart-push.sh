#!/bin/bash

echo "=== 智能推送脚本 ==="

# 1. 检查Git状态
echo "1. 检查Git状态..."
if [ -z "$(git status --porcelain)" ]; then
    echo "没有更改需要提交"
else
    echo "2. 提交更改..."
    git add .
    git commit -m "更新博客系统"
fi

# 2. 检查分支
echo "3. 检查当前分支..."
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"

# 3. 如果不是main分支，创建并切换
if [ "$current_branch" != "main" ]; then
    echo "4. 切换到main分支..."
    git checkout -b main || git checkout main
    git branch -D "$current_branch" 2>/dev/null || true
fi

# 4. 确保远程仓库存在
echo "5. 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:liliang-fuxu/blog_web.git

# 5. 推送
echo "6. 推送到GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "=== 🎉 推送成功！==="
    echo "仓库地址: https://github.com/liliang-fuxu/blog_web"
else
    echo "=== ❌ 推送失败 ==="
    echo "尝试HTTPS推送..."
    git remote set-url origin https://github.com/liliang-fuxu/blog_web.git
    git push -u origin main --force
fi