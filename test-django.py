#!/usr/bin/env python3
"""
测试Django设置
"""

import subprocess
import sys
from pathlib import Path

def test_django():
    print("=== 测试Django设置 ===")
    
    backend_dir = Path(__file__).parent / 'backend'
    
    # 测试Django检查
    print("1. 运行Django检查...")
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'check'
        ], cwd=backend_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ Django检查通过")
            print("输出:", result.stdout)
        else:
            print("❌ Django检查失败:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ 运行检查时出错: {e}")
        return False
    
    # 测试迁移
    print("\n2. 运行数据库迁移...")
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate'
        ], cwd=backend_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ 数据库迁移成功")
            print("输出:", result.stdout)
        else:
            print("❌ 数据库迁移失败:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ 运行迁移时出错: {e}")
        return False
    
    # 测试启动服务器
    print("\n3. 测试服务器启动...")
    print("注意：这只会测试服务器是否能启动，会立即停止")
    
    try:
        # 使用timeout来限制运行时间
        result = subprocess.run([
            sys.executable, 'manage.py', 'runserver', '--noreload'
        ], cwd=backend_dir, capture_output=True, text=True, timeout=5)
        
        print("服务器启动测试完成")
        
    except subprocess.TimeoutExpired:
        print("✓ 服务器能够启动（超时停止）")
        return True
    except Exception as e:
        print(f"❌ 服务器启动测试失败: {e}")
        return False
    
    print("\n🎉 所有测试通过！")
    return True

if __name__ == '__main__':
    try:
        success = test_django()
        if success:
            print("\n现在可以运行: python manage.py runserver")
        input("\n按回车键退出...")
    except KeyboardInterrupt:
        print("\n操作取消")