@echo off
echo === 清理项目并重新提交 ===

:: 清理前端缓存和大文件
echo 1. 清理前端缓存...
cd frontend
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "build" rmdir /s /q "build"
if exist ".next" rmdir /s /q ".next"
if exist ".nuxt" rmdir /s /q ".nuxt"
if exist ".vuepress" rmdir /s /q ".vuepress"
if exist "dist" rmdir /s /q "dist"

:: 删除node_modules（如果存在）
if exist "node_modules" (
    echo 删除 node_modules 目录...
    rmdir /s /q "node_modules"
)

cd ..

:: 清理后端缓存
echo 2. 清理后端缓存...
cd backend
for /r %%f in (__pycache__) do if exist "%%f" rmdir /s /q "%%f"
del /s /q *.pyc 2>nul
del /s /q *.pyo 2>nul

:: 备份数据库文件
if exist "db.sqlite3" (
    echo 备份数据库文件...
    move "db.sqlite3" "db.sqlite3.backup"
)

:: 删除静态文件和媒体文件
if exist "staticfiles" rmdir /s /q "staticfiles"
if exist "media" rmdir /s /q "media"

cd ..

:: 重新添加和提交
echo 3. 重新添加文件...
git add .
git status

echo 4. 提交更改...
git commit -m "清理大文件和缓存

- 删除node_modules/.cache缓存
- 删除Python缓存文件  
- 备份数据库文件
- 删除构建输出文件"

echo 5. 推送到远程仓库...
git push origin main

echo === 完成！===
pause