@echo off
echo === 修复前端依赖问题 ===

cd frontend

:: 1. 清理node_modules和package-lock
echo 1. 清理旧的node_modules...
if exist "node_modules" (
    echo 删除 node_modules...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo 删除 package-lock.json...
    del "package-lock.json"
)

:: 2. 使用npm安装
echo 2. 重新安装npm依赖...
npm install

:: 3. 验证react-scripts是否安装
echo 3. 验证关键依赖...
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts 安装成功
) else (
    echo ❌ react-scripts 安装失败，尝试手动安装...
    npm install react-scripts@5.0.1
)

:: 4. 测试启动
echo 4. 测试前端启动...
echo 注意：这会启动开发服务器，按Ctrl+C停止
npm start

pause