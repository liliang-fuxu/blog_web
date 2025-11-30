#!/bin/bash

echo "=== 重置Git仓库并清理大文件 ==="

# 1. 完全重置到第一个提交
echo "1. 重置Git历史..."
git reset --soft HEAD~1

# 2. 移除大文件
echo "2. 移除大文件..."
git rm -r --cached frontend/node_modules/ 2>/dev/null || true
git rm -r --cached frontend/node_modules/.cache/ 2>/dev/null || true
git rm -r --cached backend/staticfiles/ 2>/dev/null || true
git rm -r --cached backend/media/ 2>/dev/null || true
git rm --cached backend/db.sqlite3 2>/dev/null || true

# 3. 清理历史中的大文件
echo "3. 清理Git历史..."
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch -r frontend/node_modules/' --prune-empty --tag-name-filter cat
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch -r frontend/node_modules/.cache/' --prune-empty --tag-name-filter cat
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch -r backend/staticfiles/' --prune-empty --tag-name-filter cat
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch -r backend/media/' --prune-empty --tag-name-filter cat
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/db.sqlite3' --prune-empty --tag-name-filter cat

# 4. 强制清理
echo "4. 清理Git垃圾回收..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo "=== Git重置完成！现在可以重新提交 ==="
echo "运行: git add . && git commit -m '清理后的提交'"