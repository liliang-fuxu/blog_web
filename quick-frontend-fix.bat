@echo off
echo === 快速修复React启动问题 ===

cd frontend

:: 1. 检查package.json
echo 1. 检查package.json...
if not exist "package.json" (
    echo ❌ package.json 不存在
    pause
    exit /b 1
)

:: 2. 简单直接安装react-scripts
echo 2. 直接安装react-scripts...
call npm install react-scripts@5.0.1

:: 3. 验证安装
echo 3. 验证安装结果...
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts.cmd 存在
) else (
    echo ❌ react-scripts.cmd 仍然不存在
    echo 尝试全局安装...
    call npm install -g react-scripts@5.0.1
)

:: 4. 尝试启动
echo 4. 尝试启动React服务器...
echo 如果还是失败，请使用 npx 方式启动
echo.
echo 方式1: npm start
echo 方式2: npx react-scripts start
echo.

call npm start

:: 如果npm start失败，尝试npx
if %errorlevel% neq 0 (
    echo npm start 失败，尝试 npx...
    call npx react-scripts start
)

pause