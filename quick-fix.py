#!/usr/bin/env python3
"""
快速修复 - 使用简化配置
"""

import subprocess
import sys
import shutil
from pathlib import Path

def main():
    print("=== 快速修复博客系统 ===")
    
    backend_dir = Path(__file__).parent / 'backend'
    
    # 备份原settings文件
    settings_file = backend_dir / 'blog_backend' / 'settings.py'
    simple_settings = backend_dir / 'blog_backend' / 'settings_simple.py'
    
    if not simple_settings.exists():
        print("❌ 找不到简化settings文件")
        return False
    
    print("1. 使用简化配置...")
    # 备份原文件
    if settings_file.exists():
        shutil.copy2(settings_file, settings_file.with_suffix('.py.backup'))
        print("   ✓ 已备份原settings文件")
    
    # 使用简化配置
    shutil.copy2(simple_settings, settings_file)
    print("   ✓ 已应用简化配置")
    
    print("2. 安装必需依赖...")
    packages = [
        'Django',
        'djangorestframework',
        'django-cors-headers',
        'django-filter',
        'Pillow',
        'python-decouple',
        'djangorestframework-simplejwt'
    ]
    
    for package in packages:
        print(f"   安装 {package}...")
        try:
            subprocess.run([
                sys.executable, '-m', 'pip', 'install', package,
                '-i', 'https://pypi.org/simple/'
            ], check=True, capture_output=True)
            print(f"   ✓ {package} 成功")
        except subprocess.CalledProcessError:
            print(f"   ⚠ {package} 失败（可能已安装）")
    
    print("3. 创建数据库...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'migrate'
        ], cwd=backend_dir, check=True)
        print("   ✓ 数据库迁移成功")
    except subprocess.CalledProcessError as e:
        print(f"   ❌ 数据库迁移失败: {e}")
        return False
    
    print("4. 测试Django...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'check'
        ], cwd=backend_dir, check=True)
        print("   ✓ Django设置正常")
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Django设置错误: {e}")
        return False
    
    print("\n🎉 快速修复完成！")
    print("现在可以运行:")
    print("  python manage.py runserver")
    
    # 询问是否现在启动
    try:
        choice = input("\n是否现在启动服务器？(y/n): ").lower().strip()
        if choice in ['y', 'yes', '是']:
            print("启动Django服务器...")
            subprocess.run([
                sys.executable, 'manage.py', 'runserver'
            ], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\n操作取消")
    
    return True

if __name__ == '__main__':
    try:
        main()
        input("\n按回车键退出...")
    except Exception as e:
        print(f"发生错误: {e}")
        input("按回车键退出...")