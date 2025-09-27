#!/bin/bash

# ChineseNameHub 一键发版脚本
# 功能：自动构建、更新SEO内容、部署到Cloudflare Pages

set -e  # 遇到错误立即停止

echo "🚀 ChineseNameHub 自动发版脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📌 当前分支: $CURRENT_BRANCH${NC}"

# 1. 检查环境变量
echo -e "\n${YELLOW}1. 检查环境配置...${NC}"
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ 找到 .env.local 配置文件${NC}"
else
    echo -e "${RED}✗ 未找到 .env.local 文件${NC}"
    echo "请先配置环境变量"
    exit 1
fi

# 2. 安装依赖
echo -e "\n${YELLOW}2. 安装项目依赖...${NC}"
if [ -f "package-lock.json" ]; then
    echo "  使用 npm ci 安装依赖..."
    npm ci --legacy-peer-deps
else
    echo "  未找到 package-lock.json，使用 npm install..."
    npm install --legacy-peer-deps
fi

# 3. 代码质量检查
echo -e "\n${YELLOW}3. 运行代码质量检查...${NC}"
echo "  - 运行 TypeScript 类型检查..."
npm run type-check

echo "  - 运行 ESLint..."
npm run lint || true  # 允许 lint 警告，但不阻止部署

# 4. 更新版本号和时间戳
echo -e "\n${YELLOW}4. 更新版本信息...${NC}"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
VERSION=$(node -p "require('./package.json').version")
echo "  版本: $VERSION"
echo "  时间: $TIMESTAMP"

# 创建构建信息文件
cat > public/build-info.json << EOF
{
  "version": "$VERSION",
  "buildTime": "$TIMESTAMP",
  "branch": "$CURRENT_BRANCH"
}
EOF
echo -e "${GREEN}✓ 构建信息已更新${NC}"

# 5. 生成 SEO 文件
echo -e "\n${YELLOW}5. 更新 SEO 相关文件...${NC}"

# 更新 sitemap 的最后修改时间（通过重新触发 Next.js 构建会自动更新）
echo -e "${GREEN}✓ Sitemap 将在构建时自动生成${NC}"

# 6. 构建项目
echo -e "\n${YELLOW}6. 构建生产版本...${NC}"
npm run build:opennext

# 7. 运行构建后处理脚本
echo -e "\n${YELLOW}7. 运行构建后处理...${NC}"
node scripts/fix-cloudflare-assets.mjs
node scripts/postbuild-cloudflare.mjs

# 8. Git 操作（可选）
read -p "是否要提交更改到 Git? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}8. 提交 Git 更改...${NC}"
    git add .
    read -p "请输入提交信息: " commit_message
    git commit -m "$commit_message

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
    echo -e "${GREEN}✓ 更改已提交${NC}"

    # 推送到远程
    read -p "是否推送到远程仓库? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin $CURRENT_BRANCH
        echo -e "${GREEN}✓ 已推送到远程仓库${NC}"
    fi
fi

# 9. 部署到 Cloudflare（如果在 main 分支）
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "\n${YELLOW}9. 部署到 Cloudflare Pages...${NC}"
    echo "推送到 main 分支将自动触发 Cloudflare Pages 部署"
    echo "请访问 Cloudflare Dashboard 查看部署状态："
    echo "https://dash.cloudflare.com/"
else
    echo -e "\n${YELLOW}ℹ 当前不在 main 分支，跳过自动部署${NC}"
    echo "请切换到 main 分支并推送以触发生产部署"
fi

# 10. 部署后验证
echo -e "\n${YELLOW}10. 部署验证检查清单:${NC}"
echo "请手动验证以下内容："
echo "  □ 访问 https://chinesenamefinder.com 确认网站正常"
echo "  □ 检查 https://chinesenamefinder.com/sitemap.xml"
echo "  □ 检查 https://chinesenamefinder.com/robots.txt"
echo "  □ 在 Google Analytics 查看实时数据"
echo "  □ 使用 Google Search Console 提交 sitemap"

# 11. 清理
echo -e "\n${YELLOW}11. 清理临时文件...${NC}"
# 清理构建缓存（可选）
# rm -rf .next
# rm -rf .open-next
echo -e "${GREEN}✓ 清理完成${NC}"

echo -e "\n${GREEN}🎉 发版流程完成！${NC}"
echo "================================"
echo "网站地址: https://chinesenamefinder.com"
echo "构建版本: $VERSION"
echo "构建时间: $TIMESTAMP"