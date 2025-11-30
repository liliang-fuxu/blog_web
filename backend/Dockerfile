FROM python:3.9-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 复制并安装Python依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目文件
COPY . .

# 创建必要的目录
RUN mkdir -p staticfiles media

# 暴露端口
EXPOSE 8000

# 收集静态文件
RUN python manage.py collectstatic --noinput

# 启动命令
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "blog_backend.wsgi:application"]