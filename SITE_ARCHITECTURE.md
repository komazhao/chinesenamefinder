# ChineseNameHub 网站架构文档

## 🌐 网站概述

**网站名称**: ChineseNameHub (中文名汇)
**域名**: https://chinesenamefinder.com
**主要功能**: AI驱动的中文起名服务平台
**技术栈**: Next.js 15.5.4 + TypeScript + Supabase + Cloudflare Pages

## 📱 网站页面结构

### 公开页面（无需登录）

| 路径 | 页面名称 | 功能描述 | SEO优先级 |
|------|---------|---------|-----------|
| `/` | 首页 | 网站入口，展示核心价值和功能介绍 | 1.0 |
| `/[locale]` | 本地化首页 | 支持中英文切换（/zh, /en） | 0.9 |
| `/[locale]/about` | 关于我们 | 公司介绍、团队信息、发展历程 | 0.7 |
| `/[locale]/pricing` | 定价方案 | 展示不同套餐和价格 | 0.9 |
| `/[locale]/generate` | 起名生成器 | 核心功能页面，AI起名服务 | 0.9 |
| `/[locale]/blog` | 博客 | 文化文章、起名知识分享 | 0.7 |
| `/[locale]/stories` | 用户故事 | 成功案例和用户分享 | 0.7 |
| `/[locale]/help` | 帮助中心 | 常见问题和使用指南 | 0.5 |
| `/[locale]/api-docs` | API文档 | 开发者文档（预留） | 0.5 |
| `/[locale]/contact` | 联系我们 | 用户反馈和联系表单 | 0.5 |
| `/[locale]/privacy` | 隐私政策 | 法律条款 | 0.3 |
| `/[locale]/terms` | 服务条款 | 使用协议 | 0.3 |

### 需要认证的页面

| 路径 | 页面名称 | 功能描述 | 访问权限 |
|------|---------|---------|----------|
| `/[locale]/auth/login` | 登录 | 用户登录入口 | 公开 |
| `/[locale]/auth/register` | 注册 | 新用户注册 | 公开 |
| `/[locale]/auth/callback` | 认证回调 | OAuth认证回调处理 | 系统 |
| `/[locale]/dashboard` | 用户仪表板 | 个人中心，查看历史记录 | 登录用户 |
| `/[locale]/settings` | 设置 | 账户设置、偏好设置 | 登录用户 |

## 🏗️ 技术架构

### 前端架构
```
app/
├── [locale]/          # 国际化路由
│   ├── layout.tsx     # 布局组件
│   ├── page.tsx       # 页面组件
│   └── ...其他页面
├── api/              # API路由
│   ├── generate/     # 起名生成API
│   ├── names/        # 名字管理API
│   ├── create-payment/ # 支付创建API
│   └── stripe-webhook/ # Stripe回调
├── sitemap.ts        # 动态Sitemap生成
├── robots.ts         # Robots.txt配置
└── layout.tsx        # 根布局
```

### 核心组件
```
components/
├── layout/           # 布局组件
│   ├── header.tsx    # 顶部导航
│   └── footer.tsx    # 底部信息
├── ui/              # UI基础组件
├── providers/       # Context Providers
│   ├── auth-provider.tsx  # 认证状态
│   └── toast-provider.tsx # 通知提示
└── analytics/       # 分析组件
    └── google-analytics.tsx # GA集成
```

### 核心库
```
lib/
├── supabase.ts      # 数据库客户端
├── openai.ts        # AI服务集成
├── stripe.ts        # 支付集成
├── seo-config.ts    # SEO配置
└── utils.ts         # 工具函数
```

## 🌍 国际化支持

### 支持语言
- **英文** (`en`) - 默认语言
- **中文** (`zh`) - 简体中文

### 路由策略
- 自动语言检测：根据浏览器语言自动跳转
- URL前缀：`/en/*` 和 `/zh/*`
- 语言切换：顶部导航栏语言切换器

### 翻译文件
```
i18n/
├── messages/
│   ├── en.json      # 英文翻译
│   └── zh.json      # 中文翻译
├── routing.ts       # 路由配置
└── locale.ts        # 语言配置
```

## 🔍 SEO 优化

### Sitemap 配置
- **自动生成**: 使用 Next.js 动态生成
- **更新频率**: 根据页面重要性设置不同频率
- **多语言支持**: 为每个语言版本生成独立URL

### Robots.txt 配置
- 允许所有搜索引擎爬取公开页面
- 禁止爬取：API路由、用户私有页面、静态资源
- 指定 Sitemap 位置

### 元数据优化
- 每个页面独立的标题和描述
- Open Graph 标签支持
- Twitter Card 支持
- 结构化数据 (JSON-LD)

### Google 集成
- **Google Analytics**: GA4 追踪代码 (G-96DJJFZXQ6)
- **Google Search Console**: 需手动提交 sitemap

## 🚀 部署架构

### 部署平台
- **主机**: Cloudflare Pages
- **CDN**: Cloudflare 全球网络
- **数据库**: Supabase (PostgreSQL)
- **AI服务**: OpenRouter API
- **支付**: Stripe

### 构建流程
1. 代码推送到 GitHub main 分支
2. Cloudflare Pages 自动触发构建
3. 执行构建命令：`npm ci && npm run build:opennext`
4. 部署到全球边缘节点

### 环境配置
- 生产环境配置在 `wrangler.toml`
- 本地开发使用 `.env.local`

## 📊 数据流架构

### 用户认证流
```
用户 → Supabase Auth → JWT Token → API访问
         ↓
    Google OAuth
```

### 起名生成流
```
用户输入 → API验证 → OpenRouter AI → 名字生成 → 数据库存储 → 返回结果
```

### 支付流程
```
用户选择套餐 → Stripe Checkout → 支付完成 → Webhook回调 → 积分充值
```

## 🔐 安全措施

- HTTPS 强制启用
- Supabase Row Level Security (RLS)
- API 速率限制
- 环境变量加密存储
- CSP 头部配置

## 📈 监控和分析

- **性能监控**: Cloudflare Analytics
- **用户分析**: Google Analytics 4
- **错误追踪**: 浏览器控制台日志
- **API监控**: Supabase Dashboard

## 🛠️ 维护工具

### 一键发版脚本
- 位置：`scripts/deploy.sh`
- 功能：自动构建、更新SEO、部署

### 其他脚本
- `scripts/verify-setup.sh` - 环境验证
- `scripts/postbuild-cloudflare.mjs` - 构建后处理
- `scripts/fix-cloudflare-assets.mjs` - 资源修复

## 📝 开发规范

- **代码风格**: ESLint + Prettier
- **类型检查**: TypeScript 严格模式
- **Git工作流**: Feature Branch → PR → Main
- **命名规范**:
  - 组件：PascalCase
  - 函数：camelCase
  - 文件：kebab-case

## 🔄 更新维护

### 日常维护
1. 监控网站可用性
2. 检查 API 使用量
3. 更新依赖包
4. 备份数据库

### SEO 维护
1. 定期检查 Google Search Console
2. 更新 sitemap（自动）
3. 监控关键词排名
4. 优化页面加载速度

---

最后更新：2024年
版权所有：ChineseNameHub Team