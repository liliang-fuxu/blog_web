#!/usr/bin/env python3
"""
博客系统快速启动脚本 - 无需虚拟环境
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def check_python():
    """检查Python版本"""
    if sys.version_info < (3, 8):
        print("错误: 需要Python 3.8或更高版本")
        sys.exit(1)
    print("✓ Python版本检查通过")

def check_node():
    """检查Node.js版本"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✓ Node.js版本: {version}")
            return True
    except FileNotFoundError:
        pass
    print("错误: 未找到Node.js，请先安装Node.js")
    return False

def setup_backend():
    """设置后端环境"""
    backend_dir = Path(__file__).parent / 'backend'
    
    # 检查requirements.txt文件是否存在
    requirements_file = backend_dir / 'requirements.txt'
    if not requirements_file.exists():
        print(f"错误: 找不到 {requirements_file}")
        return False
    
    # 安装依赖
    print("安装后端依赖...")
    try:
        # 尝试使用更灵活的安装方式
        result = subprocess.run([
            sys.executable, '-m', 'pip', 'install', 
            '-r', 'requirements.txt',
            '--index-url', 'https://pypi.org/simple/',
            '--trusted-host', 'pypi.org'
        ], cwd=backend_dir, check=True, capture_output=True, text=True)
        print("✓ 后端依赖安装成功")
    except subprocess.CalledProcessError as e:
        print(f"后端依赖安装失败: {e}")
        print("尝试不指定版本重新安装...")
        try:
            # 如果失败，尝试逐个安装核心依赖
            core_packages = ['Django', 'djangorestframework', 'django-cors-headers']
            for package in core_packages:
                subprocess.run([
                    sys.executable, '-m', 'pip', 'install', package
                ], cwd=backend_dir, check=True)
            print("✓ 核心依赖安装成功（部分功能可能受限）")
            return True
        except:
            print("❌ 请检查网络连接或手动安装依赖")
            print("可以尝试运行: pip install Django djangorestframework django-cors-headers")
            return False
    
    # 检查环境变量文件
    env_file = backend_dir / '.env'
    if not env_file.exists():
        print("创建环境变量文件...")
        with open(env_file, 'w') as f:
            f.write("""# Django Settings
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
""")
        print("请编辑 backend/.env 文件配置数据库连接")
    
    return True

def setup_frontend():
    """设置前端环境"""
    frontend_dir = Path(__file__).parent / 'frontend'
    
    # 检查package.json是否存在
    if not (frontend_dir / 'package.json').exists():
        print("错误: 前端package.json文件不存在")
        return False
    
    # 检查node_modules是否存在
    if not (frontend_dir / 'node_modules').exists():
        print("安装前端依赖...")
        try:
            subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True)
        except subprocess.CalledProcessError:
            print("前端依赖安装失败，请检查npm是否正常工作")
            return False
    
    return True

def start_backend():
    """启动后端服务"""
    backend_dir = Path(__file__).parent / 'backend'
    print("启动Django后端服务...")
    
    # 运行数据库迁移
    try:
        subprocess.run([sys.executable, 'manage.py', 'migrate'], cwd=backend_dir, check=True)
    except subprocess.CalledProcessError:
        print("数据库迁移失败，请检查数据库配置")
        return None
    
    # 启动开发服务器
    try:
        process = subprocess.Popen([
            sys.executable, 'manage.py', 'runserver'
        ], cwd=backend_dir)
        return process
    except Exception as e:
        print(f"启动后端服务失败: {e}")
        return None

def start_frontend():
    """启动前端服务"""
    frontend_dir = Path(__file__).parent / 'frontend'
    print("启动React前端服务...")
    
    try:
        process = subprocess.Popen(['npm', 'start'], cwd=frontend_dir)
        return process
    except Exception as e:
        print(f"启动前端服务失败: {e}")
        return None

def main():
    """主函数"""
    print("=== 博客系统快速启动脚本 (无虚拟环境) ===")
    print()
    
    # 检查环境
    check_python()
    if not check_node():
        sys.exit(1)
    
    # 设置环境
    if not setup_backend():
        print("后端环境设置失败")
        sys.exit(1)
    
    if not setup_frontend():
        print("前端环境设置失败")
        sys.exit(1)
    
    print("\n=== 环境设置完成 ===")
    
    # 启动服务
    print("\n正在启动服务...")
    backend_process = start_backend()
    if not backend_process:
        print("后端服务启动失败")
        sys.exit(1)
    
    time.sleep(3)  # 等待后端启动
    
    frontend_process = start_frontend()
    if not frontend_process:
        print("前端服务启动失败")
        backend_process.terminate()
        sys.exit(1)
    
    print("\n=== 服务启动完成 ===")
    print("后端API: http://localhost:8000")
    print("管理后台: http://localhost:8000/admin/")
    print("前端应用: http://localhost:3000")
    print("\n按 Ctrl+C 停止服务")
    
    # 打开浏览器
    time.sleep(2)
    try:
        webbrowser.open('http://localhost:3000')
    except:
        pass  # 忽略浏览器打开错误
    
    # 等待用户中断
    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n正在停止服务...")
        backend_process.terminate()
        frontend_process.terminate()
        time.sleep(2)
        # 强制杀死进程
        try:
            backend_process.kill()
            frontend_process.kill()
        except:
            pass
        print("服务已停止")

if __name__ == '__main__':
    main()