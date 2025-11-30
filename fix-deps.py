#!/usr/bin/env python3
"""
修复博客系统依赖问题
"""

import subprocess
import sys
from pathlib import Path

def install_package(package):
    """安装单个包"""
    try:
        print(f"正在安装 {package}...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', package], check=True)
        print(f"✓ {package} 安装成功")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ {package} 安装失败")
        return False

def main():
    print("=== 修复博客系统依赖 ===")
    
    # 基础依赖列表
    core_packages = [
        'Django',
        'djangorestframework', 
        'django-cors-headers',
        'django-filter',           # 这个是必需的
        'Pillow',
        'python-decouple',
        'djangorestframework-simplejwt',
        'mysqlclient'             # 如果没有MySQL可以注释掉这个
    ]
    
    print("正在安装核心依赖...")
    
    failed_packages = []
    for package in core_packages:
        if not install_package(package):
            failed_packages.append(package)
    
    print(f"\n安装完成！失败: {len(failed_packages)} 个包")
    
    if failed_packages:
        print(f"失败的包: {', '.join(failed_packages)}")
        print("\n尝试手动安装:")
        for package in failed_packages:
            print(f"pip install {package}")
    
    # 测试Django是否能正常工作
    print("\n测试Django设置...")
    try:
        backend_dir = Path(__file__).parent / 'backend'
        result = subprocess.run([
            sys.executable, 'manage.py', 'check'
        ], cwd=backend_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ Django设置检查通过")
            return True
        else:
            print("❌ Django设置检查失败:")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

if __name__ == '__main__':
    success = main()
    if success:
        print("\n🎉 依赖修复完成！现在可以运行:")
        print("python manage.py migrate")
        print("python manage.py runserver")
    else:
        print("\n❌ 仍有问题，请手动解决")
    
    input("\n按回车键退出...")