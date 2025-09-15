# 📋 部署指南和上线流程

本文档详细描述了文化伴侣中文起名网站的完整部署流程，包括本地测试、生产环境配置和上线后的维护操作。

## 📚 目录

- [部署前准备](#部署前准备)
- [本地环境搭建](#本地环境搭建)
- [数据库配置](#数据库配置)
- [第三方服务配置](#第三方服务配置)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [生产环境验证](#生产环境验证)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 🚀 部署前准备

### 环境要求

- **Node.js**: >= 18.17.0
- **npm**: >= 8.0.0 或 yarn >= 1.22.0
- **Git**: 最新版本
- **操作系统**: macOS、Linux 或 Windows (WSL2)

### 账户准备

在开始部署前，请确保已注册并配置以下服务账户：

1. **GitHub** - 代码仓库和 CI/CD
2. **Supabase** - 数据库和认证服务
3. **OpenAI** - AI 起名引擎
4. **Stripe** - 支付处理
5. **Cloudflare** - CDN 和部署平台
6. **Sentry** (可选) - 错误监控
7. **Google Analytics** (可选) - 网站分析

### 成本预算规划

```typescript
const monthlyBudget = {
  // 基础设施成本
  cloudflare: 0,        // Pages 免费计划
  supabase: 0,          // 免费计划 (500MB数据库)

  // AI 服务成本
  openai: 80 * 30,      // $80/天 × 30天 = $2400/月

  // 支付处理费
  stripe: '2.9% + $0.30 per transaction',

  // 可选服务
  sentry: 0,            // 免费计划 (10K errors/月)
  customDomain: 0,      // Cloudflare 免费

  // 总估算
  estimatedTotal: '$2400-3000/月 (主要为 AI 成本)'
}
```

## 🏠 本地环境搭建

### 1. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/your-org/chinesenamefinder.git
cd chinesenamefinder

# 检查项目结构
ls -la
```

### 2. 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 验证安装
npm list --depth=0

# 检查可能的安全漏洞
npm audit
```

### 3. 环境变量配置

```bash
# 创建本地环境变量文件
cp .env.example .env.local

# 使用编辑器配置环境变量
code .env.local  # VSCode
# 或
vim .env.local   # Vim
```

### 4. 本地开发服务器

```bash
# 启动开发服务器
npm run dev

# 验证服务器启动
curl http://localhost:3000/api/health

# 在浏览器中访问
open http://localhost:3000
```

## 🗄️ 数据库配置

### Supabase 项目设置

1. **创建 Supabase 项目**
```bash
# 访问 Supabase 控制台
https://app.supabase.com/

# 创建新项目
- 项目名称: chinesenamefinder
- 数据库密码: 强密码 (记录保存)
- 区域: 选择离目标用户最近的区域
```

2. **配置数据库架构**
```sql
-- 在 Supabase SQL Editor 中执行
-- 运行 lib/database-schema.sql 中的所有SQL语句

-- 验证表结构
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 应该看到以下表:
-- user_profiles, names, payments, content_sources, user_works
```

3. **配置认证设置**
```bash
# 在 Supabase Dashboard > Authentication > Settings

# 启用邮箱认证
Email Auth: ✅ 启用

# 启用 Google OAuth (可选)
Google OAuth: ✅ 启用
Client ID: your-google-client-id
Client Secret: your-google-client-secret

# 配置重定向 URL
Site URL: http://localhost:3000 (开发环境)
Redirect URLs:
  - http://localhost:3000/auth/callback
  - https://your-domain.com/auth/callback (生产环境)
```

4. **获取数据库连接信息**
```bash
# 在 Supabase Dashboard > Settings > API

# 复制以下信息到 .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 数据库测试验证

```bash
# 测试数据库连接
npm run test:db-connection

# 测试用户注册流程
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "fullName": "Test User"
  }'
```

## 🔌 第三方服务配置

### OpenAI API 设置

1. **获取 API 密钥**
```bash
# 访问 OpenAI Platform
https://platform.openai.com/api-keys

# 创建新的 API Key
- Name: ChineseNameFinder Production
- Permissions: All
- 复制 API Key 到环境变量
```

2. **配置使用限制**
```bash
# 设置使用限制
https://platform.openai.com/account/billing/limits

# 建议设置:
- Monthly Budget: $3000
- Email Alerts: 80%, 100%
- Hard Limit: 启用
```

3. **测试 AI 服务**
```bash
# 测试 OpenAI 连接
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 测试起名 API
curl -X POST http://localhost:3000/api/generate-name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-supabase-jwt" \
  -d '{
    "englishName": "John",
    "gender": "male",
    "style": "modern"
  }'
```

### Stripe 支付配置

1. **Stripe 账户设置**
```bash
# Stripe Dashboard
https://dashboard.stripe.com/

# 获取 API 密钥
Test Keys:
- Publishable key: pk_test_...
- Secret key: sk_test_...

Production Keys (上线后):
- Publishable key: pk_live_...
- Secret key: sk_live_...
```

2. **配置 Webhook**
```bash
# Stripe Dashboard > Developers > Webhooks

# 创建 Endpoint:
URL: https://your-domain.com/api/stripe-webhook
Description: Chinese Name Finder Webhooks

# 监听事件:
- checkout.session.completed
- checkout.session.expired
- payment_intent.succeeded
- payment_intent.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

# 复制 Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **测试支付流程**
```bash
# 使用测试卡号
Card Number: 4242 4242 4242 4242
Expiry: 任意未来日期
CVC: 任意3位数字
ZIP: 任意有效邮编

# 测试支付 API
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt" \
  -d '{
    "planType": "basic"
  }'
```

## ☁️ Cloudflare Pages 部署

### 1. Cloudflare 账户设置

```bash
# 注册 Cloudflare 账户
https://dash.cloudflare.com/sign-up

# 获取 API Token
Dashboard > My Profile > API Tokens > Create Token

# 选择 "Custom Token":
Token Name: ChineseNameFinder Deploy
Permissions:
- Zone:Zone:Read
- Zone:DNS:Edit
- Account:Cloudflare Pages:Edit

# 获取 Account ID
Dashboard > 右侧边栏 > Account ID
```

### 2. GitHub Repository 设置

```bash
# 推送代码到 GitHub
git add .
git commit -m "feat: initial deployment setup"
git push origin main

# 配置 GitHub Secrets
# Settings > Secrets and variables > Actions

# 添加以下 Secrets:
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 3. Cloudflare Pages 项目创建

```bash
# 方法1: 通过 Cloudflare Dashboard
https://dash.cloudflare.com/pages

# Create a project > Connect to Git
- 选择 GitHub repository
- Project name: chinesenamefinder
- Production branch: main
- Build command: npm run build && npx @cloudflare/next-on-pages
- Build output directory: .vercel/output/static
```

```bash
# 方法2: 通过 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 Pages 项目
wrangler pages project create chinesenamefinder

# 部署
wrangler pages deploy .vercel/output/static
```

### 4. 环境变量配置

```bash
# 在 Cloudflare Pages Dashboard > Settings > Environment variables

# Production 环境变量:
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
OPENAI_API_KEY=your-production-openai-key
STRIPE_SECRET_KEY=your-production-stripe-secret
STRIPE_WEBHOOK_SECRET=your-production-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-production-stripe-public
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Preview 环境变量:
NODE_ENV=development
# ... (同样的变量，但使用测试值)
```

### 5. 自定义域名配置

```bash
# 在 Cloudflare Pages > Custom domains

# 添加自定义域名
Domain: chinesenamefinder.com
Subdomain: www.chinesenamefinder.com

# DNS 记录将自动创建
# 等待 SSL 证书激活 (通常 2-10 分钟)
```

### 6. 部署验证

```bash
# 触发部署
git push origin main

# 查看部署状态
https://dash.cloudflare.com/pages/chinesenamefinder/deployments

# 测试部署后的网站
curl -I https://your-domain.com
curl https://your-domain.com/api/health
```

## ✅ 生产环境验证

### 功能测试检查清单

```bash
# 1. 网站基本功能
□ 首页加载正常
□ 用户注册流程
□ 用户登录流程
□ Google OAuth 登录
□ AI 起名生成功能
□ 名字保存和收藏
□ 支付流程测试
□ 响应式设计 (手机/平板/桌面)

# 2. API 端点测试
□ GET /api/health - 健康检查
□ POST /api/generate-name - AI起名
□ GET /api/names - 获取名字列表
□ POST /api/create-payment - 创建支付
□ POST /api/stripe-webhook - Webhook处理

# 3. 性能测试
□ 首页加载时间 < 3秒
□ API 响应时间 < 2秒
□ 图片加载优化
□ CDN 缓存配置

# 4. SEO 和可访问性
□ Meta 标签配置
□ Open Graph 标签
□ 结构化数据
□ 无障碍性标准
□ 多语言支持
```

### 自动化测试脚本

```bash
#!/bin/bash
# test-production.sh

DOMAIN="https://your-domain.com"
echo "Testing production deployment at $DOMAIN"

# 1. 健康检查
echo "1. Health Check..."
curl -f "$DOMAIN/api/health" || exit 1

# 2. 首页加载
echo "2. Homepage Load..."
curl -f "$DOMAIN" > /dev/null || exit 1

# 3. API 响应时间测试
echo "3. API Response Time..."
time curl -f "$DOMAIN/api/health" > /dev/null

# 4. SSL 证书检查
echo "4. SSL Certificate..."
curl -I "$DOMAIN" | grep -i "HTTP/2 200" || exit 1

# 5. 性能测试 (需要安装 lighthouse)
echo "5. Lighthouse Performance..."
lighthouse "$DOMAIN" --only-categories=performance --quiet --chrome-flags="--headless"

echo "All tests passed! 🎉"
```

### 监控设置

```bash
# 1. Cloudflare Analytics
# Dashboard > Analytics & Logs > Web Analytics
# 启用 Web Analytics

# 2. Uptime 监控
# 使用第三方服务如 Pingdom, UptimeRobot
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=your-api-key&format=json&type=1&url=https://your-domain.com&friendly_name=ChineseNameFinder"

# 3. Error 监控 (Sentry)
# 已通过环境变量 NEXT_PUBLIC_SENTRY_DSN 配置

# 4. Performance 监控
# Google PageSpeed Insights API
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://your-domain.com&key=YOUR_API_KEY"
```

## 📊 监控和维护

### 日常监控指标

```typescript
const monitoringMetrics = {
  // 业务指标
  userRegistrations: 'daily', // 每日新用户注册数
  nameGenerations: 'daily',   // 每日AI起名次数
  paymentConversions: 'daily', // 每日付费转化数

  // 技术指标
  apiResponseTime: '< 2 seconds', // API响应时间
  pageLoadTime: '< 3 seconds',    // 页面加载时间
  errorRate: '< 1%',              // 错误率
  uptime: '> 99.9%',             // 可用性

  // AI成本控制
  dailyAICost: '< $80',          // 每日AI成本
  monthlyAICost: '< $2400',      // 每月AI成本
  costPerGeneration: '< $0.05',  // 每次生成成本

  // 用户体验
  conversionRate: '> 3%',        // 注册转化率
  userRetention: '> 30%',        // 用户留存率
  averageRating: '> 4.5/5'       // 平均评分
}
```

### 自动化运维脚本

```bash
#!/bin/bash
# daily-maintenance.sh

echo "=== Daily Maintenance Script ==="
date

# 1. 检查 AI 成本
echo "1. Checking AI costs..."
node scripts/check-ai-costs.js

# 2. 数据库健康检查
echo "2. Database health check..."
node scripts/check-database-health.js

# 3. 清理过期数据
echo "3. Cleaning expired data..."
node scripts/cleanup-expired-data.js

# 4. 备份关键数据
echo "4. Backing up critical data..."
node scripts/backup-data.js

# 5. 性能报告
echo "5. Generating performance report..."
node scripts/generate-performance-report.js

echo "Maintenance completed at $(date)"
```

### 扩容策略

```typescript
// 扩容阈值配置
const scalingThresholds = {
  // 用户量阈值
  users: {
    stage1: 1000,    // 1K用户 - 当前配置充足
    stage2: 10000,   // 10K用户 - 考虑升级 Supabase Pro
    stage3: 100000,  // 100K用户 - 考虑数据库集群
  },

  // API 请求阈值
  apiRequests: {
    stage1: 1000,    // 1K请求/小时
    stage2: 10000,   // 10K请求/小时 - 考虑 Redis 缓存
    stage3: 100000,  // 100K请求/小时 - 考虑负载均衡
  },

  // AI 成本阈值
  aiCosts: {
    daily: 80,       // $80/天
    monthly: 2400,   // $2400/月
    alert: 2000,     // $2000/月 - 发送告警
  }
}
```

### 更新和维护流程

```bash
# 1. 依赖更新 (每月)
npm audit                    # 检查安全漏洞
npm update                   # 更新依赖
npm audit fix               # 修复安全问题

# 2. 数据库维护 (每周)
-- 清理过期会话
DELETE FROM auth.sessions WHERE expires_at < NOW();

-- 更新统计信息
ANALYZE;

-- 检查索引使用情况
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

# 3. 性能优化 (每月)
-- 查询慢查询
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 优化图片和静态资源
npm run optimize-images
npm run analyze-bundle

# 4. 安全审计 (每季度)
npm audit                    # 依赖安全检查
node scripts/security-audit.js  # 自定义安全检查
```

## 🔧 故障排除

### 常见部署问题

#### 1. 构建失败

```bash
# 错误: "Module not found"
# 解决方案:
rm -rf node_modules .next
npm install
npm run build

# 错误: "Memory limit exceeded"
# 解决方案:
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build

# 错误: "@cloudflare/next-on-pages 兼容性"
# 解决方案:
npm install @cloudflare/next-on-pages@latest
npx @cloudflare/next-on-pages --help
```

#### 2. 数据库连接问题

```bash
# 错误: "connection refused"
# 诊断步骤:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 测试连接
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"

# 检查防火墙和网络
nslookup your-supabase-url.supabase.co
ping your-supabase-url.supabase.co
```

#### 3. AI 服务问题

```bash
# 错误: "OpenAI API limit exceeded"
# 解决方案:
# 1. 检查 API 配额
curl https://api.openai.com/v1/dashboard/billing/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 2. 实施请求限流
# 在 lib/openai.ts 中调整 DAILY_BUDGET

# 3. 启用缓存机制
# 检查 Redis 或 KV 缓存配置

# 错误: "API key invalid"
# 解决方案:
# 验证 API key 格式和权限
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 4. 支付系统问题

```bash
# 错误: "Webhook signature verification failed"
# 解决方案:
# 1. 检查 webhook secret
echo $STRIPE_WEBHOOK_SECRET

# 2. 验证 endpoint URL
curl -X POST https://your-domain.com/api/stripe-webhook \
  -H "stripe-signature: test"

# 3. 检查请求体处理
# 确保使用 request.text() 而不是 request.json()

# 错误: "Payment intent creation failed"
# 解决方案:
# 检查 Stripe API 密钥环境
curl https://api.stripe.com/v1/payment_intents \
  -u $STRIPE_SECRET_KEY: \
  -d amount=2000 \
  -d currency=usd
```

### 性能问题诊断

```bash
# 1. 页面加载速度慢
# 使用 Lighthouse 分析
npm install -g lighthouse
lighthouse https://your-domain.com --view

# 检查 CDN 缓存
curl -I https://your-domain.com | grep -i cache

# 2. API 响应慢
# 分析数据库查询
-- 在 Supabase Dashboard > Reports > Query Performance

# 检查索引使用
EXPLAIN ANALYZE SELECT * FROM names WHERE user_id = 'uuid';

# 3. 内存泄漏
# Node.js 内存监控
node --inspect scripts/memory-check.js

# 检查 Cloudflare Analytics
# Dashboard > Analytics > Performance
```

### 紧急恢复程序

```bash
#!/bin/bash
# emergency-recovery.sh

echo "=== EMERGENCY RECOVERY PROCEDURE ==="

# 1. 回滚到上一个稳定版本
git revert HEAD --no-edit
git push origin main

# 2. 切换到维护模式
# 创建维护页面
echo "<h1>网站维护中，请稍后访问</h1>" > maintenance.html
# 通过 Cloudflare Page Rules 重定向

# 3. 通知团队
curl -X POST YOUR_SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  --data '{"text":"🚨 紧急情况: 网站已切换到维护模式"}'

# 4. 数据库备份
pg_dump $DATABASE_URL > emergency_backup_$(date +%Y%m%d_%H%M%S).sql

# 5. 日志收集
mkdir emergency_logs_$(date +%Y%m%d_%H%M%S)
# 收集 Cloudflare、Supabase、Sentry 日志

echo "Recovery procedure completed. Check logs and investigate issues."
```

### 联系支持

如果遇到无法解决的问题，请按以下优先级联系支持：

1. **技术支持邮箱**: tech@culturecompanion.com
2. **GitHub Issues**: [提交技术问题](https://github.com/your-org/chinesenamefinder/issues)
3. **Slack 频道**: #tech-support (内部团队)
4. **紧急联系**: +1-xxx-xxx-xxxx (仅限生产环境故障)

---

📝 **注意**: 本文档会随着项目发展持续更新。请定期检查最新版本。

🔐 **安全提醒**: 请妥善保管所有 API 密钥和敏感信息，切勿将其提交到代码仓库。

🎯 **成功标准**: 部署成功的标志是所有功能测试通过，网站在生产环境下稳定运行，性能指标达到预期要求。