@echo off
echo === 博客系统依赖安装脚本 ===
echo.

echo 升级pip...
python -m pip install --upgrade pip -i https://pypi.org/simple/

echo.
echo 安装核心依赖...
python -m pip install Django -i https://pypi.org/simple/
python -m pip install djangorestframework -i https://pypi.org/simple/
python -m pip install django-cors-headers -i https://pypi.org/simple/
python -m pip install django-filter -i https://pypi.org/simple/
python -m pip install Pillow -i https://pypi.org/simple/
python -m pip install python-decouple -i https://pypi.org/simple/
python -m pip install djangorestframework-simplejwt -i https://pypi.org/simple/

echo.
echo 测试Django设置...
cd backend
python manage.py check

echo.
echo 运行数据库迁移...
python manage.py migrate

echo.
echo === 安装完成！ ===
echo 现在可以运行: python manage.py runserver
pause