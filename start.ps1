# 博客系统启动脚本 (PowerShell)
Write-Host "=== 博客系统启动脚本 ===" -ForegroundColor Green

# 检查Python版本
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到Python，请先安装Python 3.8+" -ForegroundColor Red
    exit 1
}

# 检查Node.js版本
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 设置后端
Write-Host "`n=== 设置后端环境 ===" -ForegroundColor Blue
Set-Location backend

# 安装Python依赖
Write-Host "安装后端依赖..." -ForegroundColor Yellow
pip install -r requirements.txt

# 创建环境变量文件
if (-not (Test-Path ".env")) {
    Write-Host "创建环境变量文件..." -ForegroundColor Yellow
    @"
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=True

# Database Configuration
DB_NAME=blog_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "请编辑 backend\.env 文件配置数据库连接" -ForegroundColor Cyan
}

# 启动后端服务
Write-Host "启动Django后端服务..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python manage.py runserver"

# 等待后端启动
Start-Sleep -Seconds 3

# 设置前端
Write-Host "`n=== 设置前端环境 ===" -ForegroundColor Blue
Set-Location ..\frontend

# 安装前端依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "安装前端依赖..." -ForegroundColor Yellow
    npm install
}

# 启动前端服务
Write-Host "启动React前端服务..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "`n=== 服务启动完成 ===" -ForegroundColor Green
Write-Host "后端API: http://localhost:8000" -ForegroundColor White
Write-Host "管理后台: http://localhost:8000/admin/" -ForegroundColor White  
Write-Host "前端应用: http://localhost:3000" -ForegroundColor White

# 打开浏览器
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host "`n按任意键停止所有服务..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 停止服务
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "服务已停止" -ForegroundColor Green