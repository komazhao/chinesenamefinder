#!/bin/bash

# 项目设置验证脚本
# Project Setup Verification Script

echo "🔍 验证文化伴侣项目设置..."
echo "Verifying Chinese Name Finder project setup..."
echo "=============================================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 验证项目结构
echo -e "\n${BLUE}📁 项目结构验证${NC}"
echo "--------------------------------"

check_file_structure() {
    local files=(
        "package.json"
        "next.config.mjs"
        "tailwind.config.ts"
        "tsconfig.json"
        "app/layout.tsx"
        "app/page.tsx"
        "lib/supabase.ts"
        "lib/openai.ts"
        "lib/stripe.ts"
        "components/ui/button.tsx"
        "components/layout/header.tsx"
        "README.md"
        "DEPLOYMENT.md"
        ".gitignore"
    )

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅${NC} $file"
        else
            echo -e "${RED}❌${NC} $file (缺失)"
        fi
    done
}

check_file_structure

# 验证配置文件内容
echo -e "\n${BLUE}🔧 配置文件验证${NC}"
echo "--------------------------------"

if grep -q "next" package.json; then
    echo -e "${GREEN}✅${NC} package.json 包含 Next.js 依赖"
else
    echo -e "${RED}❌${NC} package.json 缺少 Next.js 依赖"
fi

if grep -q "@cloudflare/next-on-pages" package.json; then
    echo -e "${GREEN}✅${NC} Cloudflare Pages 配置正确"
else
    echo -e "${RED}❌${NC} 缺少 Cloudflare Pages 配置"
fi

if grep -q "supabase" package.json; then
    echo -e "${GREEN}✅${NC} Supabase 依赖配置正确"
else
    echo -e "${RED}❌${NC} 缺少 Supabase 依赖"
fi

# 验证脚本文件
echo -e "\n${BLUE}📜 脚本文件验证${NC}"
echo "--------------------------------"

scripts=(
    "scripts/setup-local.sh"
    "scripts/test-api.sh"
    "scripts/pre-deploy-check.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo -e "${GREEN}✅${NC} $script (可执行)"
        else
            echo -e "${YELLOW}⚠️${NC} $script (需要执行权限)"
            chmod +x "$script" 2>/dev/null && echo -e "   ${GREEN}→${NC} 已添加执行权限"
        fi
    else
        echo -e "${RED}❌${NC} $script (缺失)"
    fi
done

# 验证环境变量模板
echo -e "\n${BLUE}🔐 环境变量验证${NC}"
echo "--------------------------------"

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅${NC} .env.example 存在"

    # 检查关键变量
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "OPENAI_API_KEY"
        "STRIPE_SECRET_KEY"
    )

    for var in "${required_vars[@]}"; do
        if grep -q "$var" .env.example; then
            echo -e "${GREEN}✅${NC} $var 在模板中"
        else
            echo -e "${RED}❌${NC} $var 缺失"
        fi
    done
else
    echo -e "${RED}❌${NC} .env.example 不存在"
fi

# 验证 GitHub Actions
echo -e "\n${BLUE}🚀 CI/CD 配置验证${NC}"
echo "--------------------------------"

if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✅${NC} GitHub Actions 部署配置存在"

    if grep -q "cloudflare/pages-action" .github/workflows/deploy.yml; then
        echo -e "${GREEN}✅${NC} Cloudflare Pages 部署配置正确"
    else
        echo -e "${YELLOW}⚠️${NC} Cloudflare Pages 部署配置可能不完整"
    fi
else
    echo -e "${RED}❌${NC} GitHub Actions 配置缺失"
fi

# 代码质量检查
echo -e "\n${BLUE}✨ 代码质量验证${NC}"
echo "--------------------------------"

if [ -f "node_modules" ] || [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} 依赖已安装"

    # 检查关键依赖
    if [ -f "node_modules/next/package.json" ]; then
        echo -e "${GREEN}✅${NC} Next.js 已安装"
    fi

    if [ -f "node_modules/@supabase/supabase-js/package.json" ]; then
        echo -e "${GREEN}✅${NC} Supabase 客户端已安装"
    fi
else
    echo -e "${YELLOW}⚠️${NC} 依赖未安装，运行 'npm install'"
fi

# 生成设置报告
echo -e "\n${BLUE}📋 设置完成度报告${NC}"
echo "=============================================="

total_files=14
existing_files=0

files_to_check=(
    "package.json" "next.config.mjs" "tailwind.config.ts" "tsconfig.json"
    "app/layout.tsx" "app/page.tsx" "lib/supabase.ts" "lib/openai.ts"
    "lib/stripe.ts" "components/ui/button.tsx" "components/layout/header.tsx"
    "README.md" "DEPLOYMENT.md" ".gitignore"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        existing_files=$((existing_files + 1))
    fi
done

completion_rate=$(( existing_files * 100 / total_files ))

echo "项目完成度: $existing_files/$total_files 文件 ($completion_rate%)"

if [ $completion_rate -ge 90 ]; then
    echo -e "${GREEN}🎉 项目设置完成度很高！${NC}"
elif [ $completion_rate -ge 70 ]; then
    echo -e "${YELLOW}⚠️ 项目基本完整，建议完善缺失文件${NC}"
else
    echo -e "${RED}❌ 项目设置不完整，请检查缺失文件${NC}"
fi

# 下一步建议
echo -e "\n${BLUE}📝 下一步建议${NC}"
echo "=============================================="

if [ ! -f ".env.local" ]; then
    echo "1. 复制环境变量模板: cp .env.example .env.local"
fi

if [ ! -d "node_modules" ]; then
    echo "2. 安装依赖: npm install"
fi

echo "3. 配置环境变量 (.env.local)"
echo "4. 运行本地设置脚本: ./scripts/setup-local.sh"
echo "5. 启动开发服务器: npm run dev"

echo -e "\n${GREEN}✅ 验证完成！${NC}"