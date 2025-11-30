#!/usr/bin/env python3
"""
使用官方源安装依赖
"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, check=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def main():
    print("=== 使用官方源安装依赖 ===")
    
    # 首先升级pip
    print("1. 升级pip...")
    success, output = run_command([
        sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip',
        '-i', 'https://pypi.org/simple/'
    ])
    
    if success:
        print("✓ pip升级成功")
    else:
        print("⚠ pip升级失败，继续安装依赖...")
    
    # 核心依赖包
    packages = [
        'Django',
        'djangorestframework',
        'django-cors-headers', 
        'django-filter',
        'Pillow',
        'python-decouple',
        'djangorestframework-simplejwt'
    ]
    
    print("\n2. 安装核心依赖...")
    failed_packages = []
    
    for package in packages:
        print(f"   安装 {package}...")
        success, output = run_command([
            sys.executable, '-m', 'pip', 'install', package,
            '-i', 'https://pypi.org/simple/'
        ])
        
        if success:
            print(f"   ✓ {package} 安装成功")
        else:
            print(f"   ❌ {package} 安装失败")
            failed_packages.append(package)
            print(f"   错误: {output}")
    
    # 测试Django设置
    print("\n3. 测试Django设置...")
    backend_dir = Path(__file__).parent / 'backend'
    success, output = run_command([
        sys.executable, 'manage.py', 'check'
    ], cwd=backend_dir)
    
    if success:
        print("✓ Django设置检查通过")
    else:
        print("❌ Django设置检查失败:")
        print(output)
        return False
    
    # 运行迁移
    print("\n4. 运行数据库迁移...")
    success, output = run_command([
        sys.executable, 'manage.py', 'migrate'
    ], cwd=backend_dir)
    
    if success:
        print("✓ 数据库迁移成功")
        print("\n🎉 安装完成！")
        print("现在可以运行: python manage.py runserver")
        return True
    else:
        print("❌ 数据库迁移失败:")
        print(output)
        return False

if __name__ == '__main__':
    try:
        success = main()
        input("\n按回车键退出...")
    except KeyboardInterrupt:
        print("\n用户取消操作")