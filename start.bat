@echo off
echo === 博客系统启动脚本 ===

:: 检查Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

:: 设置后端
cd /d "%~dp0backend"
echo 安装后端依赖...

:: 检查requirements.txt是否存在
if not exist "requirements.txt" (
    echo 错误: 找不到 requirements.txt 文件
    pause
    exit /b 1
)

pip install -r requirements.txt

:: 创建环境变量文件
if not exist ".env" (
    echo 创建环境变量文件...
    (
        echo # Django Settings
        echo SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
        echo DEBUG=True
        echo.
        echo # Database Configuration
        echo DB_NAME=blog_db
        echo DB_USER=root
        echo DB_PASSWORD=your_mysql_password
        echo DB_HOST=localhost
        echo DB_PORT=3306
    ) > .env
    echo 请编辑 backend\.env 文件配置数据库连接
)

:: 启动后端
echo 启动后端服务...
start "Django后端" cmd /k "python manage.py runserver"

:: 等待一下
timeout /t 3 /nobreak >nul

:: 设置前端
cd ..\frontend
echo 安装前端依赖...
if not exist "node_modules" npm install

:: 启动前端
echo 启动前端服务...
start "React前端" cmd /k "npm start"

echo.
echo === 服务启动完成 ===
echo 后端API: http://localhost:8000
echo 管理后台: http://localhost:8000/admin/
echo 前端应用: http://localhost:3000
echo.

:: 等待2秒后打开浏览器
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo 按任意键停止所有服务...
pause >nul

:: 停止所有相关进程
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo 服务已停止
pause