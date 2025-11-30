#!/bin/bash

echo "=== 安装前端依赖 ==="

cd frontend

# 1. 清理旧的依赖
echo "1. 清理旧的node_modules..."
rm -rf node_modules
rm -f package-lock.json

# 2. 检查npm是否可用
echo "2. 检查npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装Node.js"
    exit 1
fi

echo "✓ npm版本: $(npm --version)"

# 3. 安装依赖
echo "3. 安装React项目依赖..."
npm install

# 4. 验证react-scripts
echo "4. 验证react-scripts..."
if [ -f "node_modules/.bin/react-scripts" ]; then
    echo "✓ react-scripts 安装成功"
else
    echo "❌ react-scripts 未找到，手动安装..."
    npm install react-scripts@5.0.1 --save
fi

# 5. 测试启动
echo "5. 启动React开发服务器..."
echo "注意：服务器启动在 http://localhost:3000"
echo "按 Ctrl+C 停止服务器"
npm start