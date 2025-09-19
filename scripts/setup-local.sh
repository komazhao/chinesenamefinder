#!/bin/bash

# 文化伴侣 - 本地开发环境一键设置脚本
# Chinese Name Finder - Local Development Setup Script

set -e

echo "🚀 正在设置文化伴侣本地开发环境..."
echo "Setting up Chinese Name Finder local development environment..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18.17.0 或更高版本"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 npm 版本
NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 检查环境变量文件
echo "🔧 检查环境变量配置..."
if [ ! -f .env.local ]; then
    echo "📄 创建环境变量文件..."
    cp .env.example .env.local
    echo "⚠️  请编辑 .env.local 文件，配置必要的环境变量:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - OPENROUTER_API_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
fi

# 检查必要的环境变量
echo "🔍 验证关键环境变量..."
source .env.local 2>/dev/null || true

MISSING_VARS=()

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_URL")
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    MISSING_VARS+=("OPENROUTER_API_KEY")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  以下环境变量需要配置:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "请编辑 .env.local 文件后重新运行此脚本"
    exit 1
fi

# 类型检查
echo "🔍 运行 TypeScript 类型检查..."
npm run type-check

# 代码规范检查
echo "🔍 运行代码规范检查..."
npm run lint

echo ""
echo "✅ 本地开发环境设置完成！"
echo ""
echo "📖 接下来的步骤:"
echo "1. 确保已在 Supabase 中运行数据库架构 (lib/database-schema.sql)"
echo "2. 启动开发服务器: npm run dev"
echo "3. 在浏览器中访问: http://localhost:3000"
echo ""
echo "📚 相关文档:"
echo "- README.md - 项目概述和快速开始"
echo "- DEPLOYMENT.md - 详细的部署指南"
echo ""
echo "🎉 开发愉快！Happy coding!"
