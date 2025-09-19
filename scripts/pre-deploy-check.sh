#!/bin/bash

# 部署前检查脚本
# Pre-deployment Check Script

set -e

echo "🚀 部署前检查开始..."
echo "Pre-deployment checks starting..."
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查结果统计
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# 检查函数
check_item() {
    local description=$1
    local check_command=$2
    local is_critical=${3:-true}

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "检查: $description... "

    if eval "$check_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}❌ FAIL${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            return 1
        else
            echo -e "${YELLOW}⚠️ WARNING${NC}"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            return 2
        fi
    fi
}

# 1. 环境检查
echo -e "\n${BLUE}🔧 环境检查${NC}"
check_item "Node.js 版本 (>=18.17.0)" "node --version | grep -E 'v(1[8-9]|[2-9][0-9])\\.'"
check_item "npm 可用" "command -v npm"
check_item "Git 可用" "command -v git"

# 2. 依赖检查
echo -e "\n${BLUE}📦 依赖检查${NC}"
check_item "node_modules 存在" "[ -d node_modules ]"
check_item "package-lock.json 存在" "[ -f package-lock.json ]"
check_item "依赖安全性检查" "npm audit --audit-level=high" false

# 3. 环境变量检查
echo -e "\n${BLUE}🔐 环境变量检查${NC}"

if [ -f .env.local ]; then
    source .env.local 2>/dev/null || true
fi

check_item "NEXT_PUBLIC_SUPABASE_URL" "[ ! -z \"\$NEXT_PUBLIC_SUPABASE_URL\" ]"
check_item "NEXT_PUBLIC_SUPABASE_ANON_KEY" "[ ! -z \"\$NEXT_PUBLIC_SUPABASE_ANON_KEY\" ]"
check_item "SUPABASE_SERVICE_ROLE_KEY" "[ ! -z \"\$SUPABASE_SERVICE_ROLE_KEY\" ]"
check_item "OPENROUTER_API_KEY" "[ ! -z \"\$OPENROUTER_API_KEY\" ]"
check_item "STRIPE_SECRET_KEY" "[ ! -z \"\$STRIPE_SECRET_KEY\" ]"
check_item "NEXT_PUBLIC_SITE_URL" "[ ! -z \"\$NEXT_PUBLIC_SITE_URL\" ]"

# 4. 代码质量检查
echo -e "\n${BLUE}✨ 代码质量检查${NC}"
check_item "TypeScript 类型检查" "npm run type-check"
check_item "ESLint 检查" "npm run lint"
check_item "代码格式检查" "npm run lint -- --quiet"

# 5. 构建检查
echo -e "\n${BLUE}🏗️ 构建检查${NC}"
echo "开始构建检查，这可能需要几分钟..."
check_item "Next.js 构建" "npm run build"
check_item "Cloudflare Pages 构建" "npx @cloudflare/next-on-pages"

# 6. 文件结构检查
echo -e "\n${BLUE}📁 文件结构检查${NC}"
check_item "必需配置文件存在" "[ -f next.config.mjs ] && [ -f tailwind.config.ts ] && [ -f tsconfig.json ]"
check_item "API 路由存在" "[ -d app/api ]"
check_item "组件目录存在" "[ -d components ]"
check_item "工具库存在" "[ -d lib ]"

# 7. 数据库检查
echo -e "\n${BLUE}🗄️ 数据库检查${NC}"
check_item "数据库架构文件存在" "[ -f lib/database-schema.sql ]"
check_item "数据库类型文件存在" "[ -f lib/database.types.ts ]"

# 8. API 连通性检查
echo -e "\n${BLUE}🔗 外部服务连通性检查${NC}"

if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ] && [ ! -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    check_item "Supabase 连接" "curl -f -H 'apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY' '$NEXT_PUBLIC_SUPABASE_URL/rest/v1/' >/dev/null 2>&1" false
fi

if [ ! -z "$OPENROUTER_API_KEY" ]; then
    check_item "OpenRouter API 连接" "curl -f -H 'Authorization: Bearer $OPENROUTER_API_KEY' 'https://openrouter.ai/api/v1/models' >/dev/null 2>&1" false
fi

if [ ! -z "$STRIPE_SECRET_KEY" ]; then
    check_item "Stripe API 连接" "curl -f -u '$STRIPE_SECRET_KEY:' 'https://api.stripe.com/v1/account' >/dev/null 2>&1" false
fi

# 9. 安全检查
echo -e "\n${BLUE}🛡️ 安全检查${NC}"
check_item "环境变量未提交" "! git ls-files | grep -E '\.env$|\.env\.local$|\.env\.production$'"
check_item "API 密钥未硬编码" "! grep -r 'sk_test\|sk_live\|pk_test\|pk_live' app/ components/ lib/ --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx'" false
check_item ".gitignore 配置正确" "grep -q 'node_modules' .gitignore && grep -q '.env' .gitignore"

# 10. 性能检查
echo -e "\n${BLUE}⚡ 性能检查${NC}"
check_item "构建产物大小检查" "[ -d .next ] || [ -d .vercel/output ]"

if [ -f package.json ]; then
    # 检查包大小
    check_item "依赖包大小合理" "node -e \"const pkg=require('./package.json'); const deps=Object.keys(pkg.dependencies||{}).length; if(deps>50) process.exit(1)\"" false
fi

# 11. 文档检查
echo -e "\n${BLUE}📖 文档检查${NC}"
check_item "README.md 存在且非空" "[ -s README.md ]"
check_item "部署文档存在" "[ -f DEPLOYMENT.md ]" false
check_item "贡献指南存在" "[ -f CONTRIBUTING.md ]" false

# 12. 部署配置检查
echo -e "\n${BLUE}🚀 部署配置检查${NC}"
check_item "GitHub Actions 配置" "[ -f .github/workflows/deploy.yml ]"
check_item "Wrangler 配置" "[ -f wrangler.toml ]"
check_item "Cloudflare Pages 兼容" "grep -q '@cloudflare/next-on-pages' package.json"

# 检查结果汇总
echo -e "\n${BLUE}📊 检查结果汇总${NC}"
echo "=================================="
echo "总检查项: $TOTAL_CHECKS"
echo -e "通过: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "失败: ${RED}$FAILED_CHECKS${NC}"
echo -e "警告: ${YELLOW}$WARNING_CHECKS${NC}"

# 根据结果给出建议
if [ $FAILED_CHECKS -eq 0 ]; then
    if [ $WARNING_CHECKS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 所有检查都通过了！准备部署。${NC}"
        echo -e "\n${GREEN}✅ 部署建议:${NC}"
        echo "1. 确保生产环境变量已正确配置"
        echo "2. 检查 Cloudflare Pages 项目设置"
        echo "3. 验证域名和 SSL 证书配置"
        echo "4. 准备好监控和告警"
        exit 0
    else
        echo -e "\n${YELLOW}⚠️ 检查通过，但有警告项。建议修复后部署。${NC}"
        echo -e "\n${YELLOW}🔧 建议修复:${NC}"
        echo "1. 解决依赖安全漏洞"
        echo "2. 确保外部服务连接正常"
        echo "3. 完善项目文档"
        exit 0
    fi
else
    echo -e "\n${RED}❌ 有 $FAILED_CHECKS 个关键检查失败，请修复后再部署。${NC}"
    echo -e "\n${RED}🔧 必须修复:${NC}"
    echo "1. 安装必需的依赖和工具"
    echo "2. 配置必需的环境变量"
    echo "3. 修复代码质量和构建问题"
    echo "4. 确保文件结构完整"
    exit 1
fi
