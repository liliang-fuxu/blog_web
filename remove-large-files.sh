#!/bin/bash

echo "=== 彻底删除Git历史中的大文件 ==="

# 1. 下载BFG工具（如果没有的话）
if ! command -v bfg-repo-cleaner &> /dev/null; then
    echo "1. 下载BFG Repo-Cleaner..."
    wget -O bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
    chmod +x bfg.jar
    alias bfg-repo-cleaner="java -jar bfg.jar"
fi

# 2. 使用BFG删除node_modules/.cache目录
echo "2. 删除Git历史中的 node_modules/.cache..."
bfg-repo-cleaner --delete-dirs node_modules/.cache

# 3. 删除其他可能的大目录
echo "3. 删除其他大目录..."
bfg-repo-cleaner --delete-dirs node_modules
bfg-repo-cleaner --delete-dirs __pycache__
bfg-repo-cleaner --delete-dirs staticfiles
bfg-repo-cleaner --delete-dirs media

# 4. 删除特定的大文件
echo "4. 删除大文件..."
bfg-repo-cleaner --delete-files "*.pack"

# 5. 清理Git仓库
echo "5. 清理Git仓库..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 6. 重新推送
echo "6. 强制推送清理后的仓库..."
git push origin main --force

echo "=== 大文件删除完成！==="
echo "如果还有问题，可能需要完全重新初始化仓库"