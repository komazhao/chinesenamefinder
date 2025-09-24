# Chinese Name Finder - AI中文起名网站

![Culture Companion](https://img.shields.io/badge/Culture%20Companion-v1.0-red)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Status](https://img.shields.io/badge/Status-Live%20Production-success)

> 🌟 **生产环境**: https://chinesenamefinder.com
>
> 专业的AI中文起名服务平台，为全球用户提供富有文化内涵的中文名字生成体验。

## 📖 项目简介

Chinese Name Finder（文化伴侣）是一个基于AI技术的中文起名服务平台，为全球用户提供专业、智能的中文名生成与文化体验服务。

### 核心特性

- 🤖 **AI智能起名** - 基于 GPT-4 的专业起名引擎
- 🌍 **双语支持** - 完整的中英文界面
- 🎨 **多种风格** - 传统、现代、优雅、自然、文学等
- 🔐 **用户认证** - 邮箱注册 + Google OAuth
- 💳 **支付系统** - Stripe 积分购买
- 📱 **响应式设计** - 完美支持移动端

## 🚀 技术栈

### 前端
- **框架**: Next.js 15.5.3 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Radix UI
- **国际化**: next-intl

### 后端
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **AI服务**: OpenRouter API
- **支付**: Stripe
- **部署**: Cloudflare Pages

## 💻 本地开发

### 环境要求

- Node.js >= 18.17.0
- npm >= 8

### 快速开始

1. **克隆仓库**
```bash
git clone https://github.com/komazhao/chinesenamefinder.git
cd chinesenamefinder
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 填入必要的环境变量
```

必需的环境变量：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Stripe (可选)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产构建（Cloudflare）
npm run build:opennext

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 🌐 部署

项目使用 Cloudflare Pages 部署，配置文件为 `wrangler.toml`。

### 自动部署

推送代码到 `main` 分支会自动触发 Cloudflare Pages 部署：

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### 手动部署

```bash
# 构建
npm run build:opennext

# 后处理
node scripts/postbuild-cloudflare.mjs

# 部署
npx wrangler pages deploy .open-next --project-name=chinesenamefinder
```

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 项目结构

```
chinesenamefinder/
├── app/                 # Next.js App Router
│   ├── [locale]/       # 国际化页面
│   ├── api/            # API 路由
│   └── globals.css     # 全局样式
├── components/         # React 组件
│   ├── ui/            # 基础 UI 组件
│   ├── layout/        # 布局组件
│   └── providers/     # Context Providers
├── lib/               # 核心库和工具
│   ├── supabase.ts   # Supabase 客户端
│   ├── openai.ts     # AI 引擎
│   └── stripe.ts     # 支付集成
├── i18n/              # 国际化配置
├── scripts/           # 构建和部署脚本
├── public/            # 静态资源
└── wrangler.toml      # Cloudflare 配置
```

## 🔧 配置说明

### Supabase 配置

1. 在 [Supabase Dashboard](https://supabase.com) 创建项目
2. 运行 `lib/database-schema.sql` 初始化数据库
3. 配置 Authentication > URL Configuration
4. 启用 Google OAuth Provider

### OpenRouter 配置

1. 在 [OpenRouter](https://openrouter.ai) 获取 API Key
2. 设置每日/月度预算限制
3. 选择合适的 AI 模型

### Stripe 配置（可选）

1. 获取测试/生产密钥
2. 配置 Webhook Endpoint
3. 设置产品和价格

## 📚 文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署说明
- [项目总结](./PROJECT_SUMMARY.md) - 项目完整总结

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🙏 致谢

- Next.js 团队提供的优秀框架
- Supabase 提供的开源后端服务
- OpenRouter 提供的 AI 服务
- Cloudflare 提供的全球部署平台

---

🚀 **网站已上线运行**: https://chinesenamefinder.com

如有问题，请提交 [Issue](https://github.com/komazhao/chinesenamefinder/issues)