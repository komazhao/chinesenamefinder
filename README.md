# 文化伴侣 - AI赋能的中文起名网站

![Culture Companion](https://img.shields.io/badge/Culture%20Companion-v1.0-red)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange)

> 🌟 专业的AI中文起名服务平台，为全球用户提供富有文化内涵的中文名字生成体验，融合传统文化与现代AI技术。

## 📖 项目简介

文化伴侣（Culture Companion）是一个基于AI技术的中文起名服务平台，旨在为非华裔用户提供专业、智能的中文名生成与文化体验服务。项目严格按照PRD需求文档实现，采用现代化的技术栈确保高性能和用户体验。

### 🎯 核心价值

- **AI智能起名**：基于GPT-4的专业起名引擎
- **文化深度融合**：每个名字都包含深刻的文化内涵
- **多样化风格**：传统、现代、优雅、自然、文学等多种风格
- **发音指导**：提供准确的拼音和发音音频
- **全球化服务**：支持多语言界面和本地化体验

## 🏗️ 技术架构

### 核心技术栈

```typescript
const techStack = {
  // 前端框架
  frontend: "Next.js 15 (App Router)",
  language: "TypeScript 5.3",
  styling: "Tailwind CSS + Radix UI",

  // 后端服务
  database: "Supabase PostgreSQL",
  auth: "Supabase Auth",
  storage: "Supabase Storage",

  // AI服务
  ai: "OpenRouter (GPT-4 family)",

  // 支付系统
  payment: "Stripe",

  // 部署平台
  deployment: "Cloudflare Pages + Edge Functions",

  // 监控工具
  monitoring: "Sentry",
  analytics: "Google Analytics"
}
```

### 系统架构图

```
用户浏览器
    ↓
Cloudflare CDN
    ↓
Cloudflare Pages (Next.js SSR)
    ↓
┌─────────────────────────────────────────┐
│        Pages Functions (Edge Runtime)   │
│  • app/api/generate-name                │
│  • app/api/stripe-webhook               │
│  • app/api/names                        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────┬─────────────────┐
│  Supabase       │ External APIs    │
│  • Auth         │ • OpenRouter AI  │
│  • PostgreSQL   │ • Stripe         │
│  • Storage      │ • TTS Services   │
└─────────────────┴─────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js 18.17.0 或更高版本
- npm 或 yarn 包管理器
- Git

### 本地开发环境搭建

1. **克隆仓库**
```bash
git clone https://github.com/your-org/chinesenamefinder.git
cd chinesenamefinder
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境变量配置**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量文件
vim .env.local
```

4. **配置环境变量**
```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter API
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Stripe 配置
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **数据库初始化**
```bash
# 在 Supabase 控制台中执行数据库架构
# 运行 lib/database-schema.sql 中的 SQL 语句
```

6. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

7. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 🧪 运行测试

```bash
# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 修复代码格式问题
npm run lint --fix
```

## 📚 项目结构

```
chinesenamefinder/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── generate-name/        # AI起名API
│   │   ├── names/                # 名字管理API
│   │   ├── create-payment/       # 支付API
│   │   └── stripe-webhook/       # Stripe Webhook
│   ├── auth/                     # 认证页面
│   ├── dashboard/                # 用户面板
│   ├── generate/                 # 起名生成器
│   ├── pricing/                  # 定价页面
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── sections/                 # 页面区块组件
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   └── ...
│   └── providers/                # Context Providers
│       ├── auth-provider.tsx
│       ├── theme-provider.tsx
│       └── toast-provider.tsx
├── hooks/                        # 自定义Hooks
│   └── useAuth.ts
├── lib/                          # 工具库
│   ├── supabase.ts              # Supabase客户端
│   ├── openai.ts                # OpenRouter起名引擎
│   ├── stripe.ts                # Stripe支付
│   ├── database.types.ts        # 数据库类型
│   ├── database-schema.sql      # 数据库架构
│   └── utils.ts                 # 工具函数
├── types/                        # TypeScript类型定义
├── public/                       # 静态资源
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── deploy.yml           # 部署工作流
├── package.json                  # 项目配置
├── next.config.mjs              # Next.js配置
├── tailwind.config.ts           # Tailwind配置
├── tsconfig.json                # TypeScript配置
├── wrangler.toml                # Cloudflare配置
└── README.md                    # 项目文档
```

## 🔧 核心功能模块

### 1. AI起名引擎 (`lib/openai.ts`)

```typescript
interface NameRequest {
  englishName: string
  gender: 'male' | 'female' | 'neutral'
  style: 'traditional' | 'modern' | 'elegant' | 'nature' | 'literary'
  preferences?: {
    avoidWords?: string[]
    preferredElements?: string[]
    meaningFocus?: string
  }
}

// 使用示例
const generator = new NameGenerator(apiKey)
const result = await generator.generateNames({
  englishName: "David",
  gender: "male",
  style: "modern"
})
```

### 2. 用户认证系统 (`components/providers/auth-provider.tsx`)

```typescript
// 使用认证Hook
const { user, profile, signIn, signUp, signOut } = useAuth()

// 登录
await signIn('email@example.com', 'password')

// 注册
await signUp('email@example.com', 'password', 'Full Name')

// Google登录
await signInWithGoogle()
```

### 3. 支付系统 (`lib/stripe.ts`)

```typescript
// 创建支付会话
const session = await createCheckoutSession({
  planType: 'basic',
  userId: 'user-id',
  userEmail: 'user@example.com',
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel'
})
```

## 🌐 部署指南

### Cloudflare Pages 部署

1. **准备 Cloudflare 账户**
   - 注册 [Cloudflare](https://dash.cloudflare.com/sign-up) 账户
   - 获取 API Token 和 Account ID

2. **配置 GitHub Secrets**
```bash
# 必需的 Secrets
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-api-key
STRIPE_SECRET_KEY=your-stripe-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

3. **部署流程**
```bash
# 本地构建测试
npm run build
npx @opennextjs/cloudflare@latest build

# 推送到 GitHub（自动触发部署）
git add .
git commit -m "feat: deploy to production"
git push origin main
```

4. **域名配置**
   - 在 Cloudflare Pages 中配置自定义域名
   - 更新 DNS 记录指向 Cloudflare
   - 配置 SSL/TLS 证书

### 环境变量配置

在 Cloudflare Pages 控制台中配置环境变量：

```bash
# 生产环境变量
APP_STAGE=production
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
OPENROUTER_API_KEY=your-production-openrouter-key
STRIPE_SECRET_KEY=your-production-stripe-secret
STRIPE_WEBHOOK_SECRET=your-production-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-production-stripe-public
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

> 预览环境请将 `APP_STAGE` 设置为 `preview`，并按照需要替换为测试凭据。

## 📊 数据库设计

### 核心表结构

```sql
-- 用户档案表
user_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  credits_remaining INTEGER DEFAULT 5,
  subscription_tier TEXT DEFAULT 'free',
  cultural_preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 名字记录表
names (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  english_name TEXT,
  chinese_name TEXT,
  pinyin TEXT,
  meaning TEXT,
  style TEXT,
  generation_type TEXT,
  source_data JSONB,
  quality_score INTEGER,
  is_favorite BOOLEAN,
  created_at TIMESTAMPTZ
)

-- 支付记录表
payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  stripe_session_id TEXT,
  amount_cents INTEGER,
  credits_purchased INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ
)
```

## 🔐 安全配置

### 数据安全
- 行级安全策略 (RLS) 保护用户数据
- API 密钥和敏感信息使用环境变量
- Webhook 签名验证
- HTTPS 强制加密传输

### 访问控制
```sql
-- 用户只能访问自己的数据
CREATE POLICY "users_own_data" ON names
  FOR ALL USING (auth.uid() = user_id);

-- 支付记录只能查看不能修改
CREATE POLICY "payments_read_only" ON payments
  FOR SELECT USING (auth.uid() = user_id);
```

### AI成本控制
```typescript
// 预算限制配置
const DAILY_BUDGET = 80    // $80/天
const MONTHLY_BUDGET = 2400 // $2400/月

// 用户限流
const rateLimits = {
  free: '5次/天',
  basic: '20次/天',
  premium: '100次/天'
}
```

## 🧪 测试和验证

### 本地测试步骤

1. **功能测试**
```bash
# 启动开发服务器
npm run dev

# 测试用户注册登录
# 测试AI起名生成
# 测试支付流程
# 测试名字保存收藏
```

2. **API测试**
```bash
# 测试起名API
curl -X POST http://localhost:3000/api/generate-name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "englishName": "John",
    "gender": "male",
    "style": "modern"
  }'

# 测试支付API
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "planType": "basic"
  }'
```

3. **性能测试**
```bash
# 页面加载速度测试
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# API响应时间测试
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/generate-name
```

### 部署前检查清单

- [ ] 所有环境变量已正确配置
- [ ] 数据库架构已部署
- [ ] Stripe Webhook 已配置
- [ ] OpenRouter API 额度充足
- [ ] 域名 DNS 已正确解析
- [ ] SSL 证书已安装
- [ ] 监控和日志已配置

## 🔍 故障排除

### 常见问题

1. **构建失败**
```bash
# 检查 Node.js 版本
node --version  # 需要 >= 18.17.0

# 清除缓存重新安装
rm -rf node_modules .next
npm install
```

2. **Supabase 连接失败**
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 验证 API 密钥有效性
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

3. **AI 生成失败**
```bash
# 检查 OpenRouter API 密钥
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"

# 检查成本限制
# 查看 lib/openai.ts 中的预算配置
```

4. **支付失败**
```bash
# 验证 Stripe 配置
curl https://api.stripe.com/v1/account \
  -u $STRIPE_SECRET_KEY:

# 检查 Webhook 端点
curl -X POST https://your-domain.com/api/stripe-webhook \
  -H "stripe-signature: test"
```

## 🤝 贡献指南

### 开发流程

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

```bash
# 代码格式化
npm run lint --fix

# 类型检查
npm run type-check

# 提交前检查
npm run pre-commit
```

### 提交信息规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 工程化配置
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 现代化 React 框架
- [Supabase](https://supabase.com/) - 开源 Firebase 替代方案
- [OpenRouter](https://openrouter.ai/) - 多模型 AI 接入平台
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Cloudflare](https://www.cloudflare.com/) - 全球CDN和部署平台

## 📞 联系我们

- 项目网站: [https://chinesenamefinder.com](https://chinesenamefinder.com)
- 技术支持: tech@culturecompanion.com
- 商务合作: business@culturecompanion.com
- GitHub Issues: [提交问题](https://github.com/your-org/chinesenamefinder/issues)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

🌏 让AI连接世界文化，让每个名字都有故事。
