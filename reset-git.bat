@echo off
echo === 重置Git仓库并清理大文件 ===

:: 1. 移除大文件索引
echo 1. 移除大文件...
git rm -r --cached frontend\node_modules 2>nul
git rm -r --cached frontend\node_modules\.cache 2>nul  
git rm -r --cached backend\staticfiles 2>nul
git rm -r --cached backend\media 2>nul
git rm --cached backend\db.sqlite3 2>nul

:: 2. 提交移除大文件的更改
echo 2. 提交更改...
git add .gitignore
git commit -m "移除大文件并更新gitignore"

:: 3. 强制推送
echo 3. 强制推送到远程仓库...
git push origin main -f

echo === Git重置完成！===
echo 如果还有问题，可能需要完全重新初始化仓库
pause