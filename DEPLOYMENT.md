# 部署文档

## 🎉 生产环境

网站已成功部署到 Cloudflare Pages：**https://chinesenamefinder.com**

## 📊 项目状态

**项目名称**: ChineseNameHub (中文名汇)
**开发状态**: ✅ 已成功上线运行
**技术栈**: Next.js 15.5.4 + Supabase + OpenRouter + Stripe + Cloudflare Pages

## 技术架构

- **前端框架**: Next.js 15.5.3 (App Router)
- **部署平台**: Cloudflare Pages
- **构建工具**: OpenNext (@opennextjs/cloudflare)
- **数据库**: Supabase (PostgreSQL)
- **AI服务**: OpenRouter API
- **支付**: Stripe
- **国际化**: next-intl (支持中英双语)

## 部署配置

### 1. Cloudflare Pages 设置

**构建配置** (`wrangler.toml`):
```toml
name = "chinesenamefinder"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next"
```

**构建命令**:
```bash
npm ci && npm run build:opennext
```

### 2. 环境变量配置

所有环境变量都配置在 `wrangler.toml` 的 `[vars]` 部分：

```toml
[vars]
APP_STAGE = "production"
NEXT_PUBLIC_SITE_URL = "https://chinesenamefinder.com"

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL = "https://jdwrdqithnxlszlnqfrp.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
SUPABASE_SERVICE_ROLE_KEY = "your-service-key"

# OpenRouter AI 配置
OPENROUTER_API_KEY = "your-openrouter-key"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Stripe 配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "your-stripe-key"
STRIPE_SECRET_KEY = "your-stripe-secret"
STRIPE_WEBHOOK_SECRET = "your-webhook-secret"
```

**重要提示**：当 `wrangler.toml` 存在时，Cloudflare Pages UI 中配置的环境变量会被忽略。所有变量必须在 `wrangler.toml` 中配置。

### 3. OpenNext 构建脚本

`package.json` 中的构建脚本：
```json
{
  "scripts": {
    "build:opennext": "open-next build --minify"
  }
}
```

### 4. 后处理脚本

`scripts/postbuild-cloudflare.mjs` 处理以下任务：
- 创建自定义 worker 处理静态资源和动态路由
- 将 `worker.js` 复制为 `_worker.js`（Cloudflare Pages 要求）
- 配置静态资源缓存策略

### 5. Supabase 配置

在 Supabase Dashboard 中配置：

**Authentication > URL Configuration**:
- Site URL: `https://chinesenamefinder.com`
- Redirect URLs:
  - `https://chinesenamefinder.com/en/auth/callback`
  - `https://chinesenamefinder.com/zh/auth/callback`
  - `https://chinesenamefinder.com/en/dashboard`
  - `https://chinesenamefinder.com/zh/dashboard`

**Google OAuth 配置**:
1. 在 Google Cloud Console 中添加授权重定向 URI:
   - `https://jdwrdqithnxlszlnqfrp.supabase.co/auth/v1/callback`
2. 在 Supabase Dashboard 启用 Google Provider，填入 Client ID 和 Client Secret

## 路由配置

### 国际化路由

使用 `next-intl` 配置，所有路由都带语言前缀：
- 英文路由: `/en/about`, `/en/generate`, `/en/pricing` 等
- 中文路由: `/zh/about`, `/zh/generate`, `/zh/pricing` 等

**配置文件** (`i18n/locale.ts`):
```typescript
export const locales = ["en", "zh"];
export const defaultLocale = "en";
export const localePrefix = "always";
```

**中间件** (`middleware.ts`):
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.webmanifest$).*)', '/']
};
```

## 部署流程

### 自动部署（推荐）

1. 推送代码到 GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Cloudflare Pages 自动触发部署
3. 等待部署完成（约2-3分钟）

### 手动部署

如需手动部署：
```bash
# 1. 本地构建
npm run build:opennext

# 2. 运行后处理脚本
node scripts/postbuild-cloudflare.mjs

# 3. 使用 Wrangler 部署
npx wrangler pages deploy .open-next --project-name=chinesenamefinder
```

## 故障排查

### 常见问题及解决方案

1. **环境变量未生效**
   - 确保所有变量都在 `wrangler.toml` 的 `[vars]` 部分配置
   - 重新部署以使更改生效

2. **路由 404 错误**
   - 检查 `middleware.ts` 配置
   - 确认 `localePrefix` 设置为 `"always"`
   - 验证页面文件在 `app/[locale]/` 目录下

3. **OAuth 登录失败**
   - 检查 Supabase Dashboard 的 Site URL 配置
   - 清除浏览器缓存
   - 确认 Google OAuth 回调 URL 正确配置

4. **静态资源加载失败**
   - 检查 `postbuild-cloudflare.mjs` 脚本执行
   - 验证 `_worker.js` 文件生成
   - 确认静态资源路径正确

## 监控和日志

- **Cloudflare Pages**: 查看部署日志和实时日志
- **Supabase Dashboard**: 监控数据库和认证日志
- **Stripe Dashboard**: 查看支付相关日志

## 性能优化

- 静态资源通过 Cloudflare CDN 全球分发
- Next.js 自动代码分割和懒加载
- 图片使用 Next.js Image 组件优化
- API 路由使用 Edge Runtime 提升响应速度

## 安全配置

- 所有敏感配置通过环境变量管理
- Supabase Row Level Security (RLS) 保护数据
- HTTPS 强制启用
- CSP 头部配置保护 XSS 攻击

## 📈 项目里程碑

### Phase 1 (已完成) ✅
- [x] 项目初始化和架构设计
- [x] 数据库设计和 Supabase 集成
- [x] 用户认证系统（邮箱 + OAuth）
- [x] AI 起名核心功能
- [x] 支付系统集成
- [x] 国际化支持
- [x] Cloudflare Pages 部署

### Phase 2 (计划中)
- [ ] 五行命名系统
- [ ] 诗意命名引擎
- [ ] 名字含义详解
- [ ] 用户社区功能
- [ ] 移动端 App

## 🎯 关键技术决策

1. **使用 OpenNext 而非 Vercel**: 更好的 Cloudflare Pages 集成，零冷启动
2. **选择 Supabase 而非 Firebase**: 开源、PostgreSQL、更灵活
3. **OpenRouter 而非直接调用 OpenAI**: 统一的 API 接口，多模型支持
4. **Next.js 15 App Router**: 最新架构，更好的性能

## 维护建议

1. 定期更新依赖包
2. 监控 Supabase 使用量
3. 定期备份数据库
4. 监控 OpenRouter API 使用情况
5. 定期审查安全日志

## 本地开发

### 环境准备

1. 克隆仓库：
```bash
git clone https://github.com/komazhao/chinesenamefinder.git
cd chinesenamefinder
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env.local
# 编辑 .env.local 填入必要的环境变量
```

4. 启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 代码质量检查

```bash
# Lint 检查
npm run lint

# 类型检查
npm run type-check

# 构建测试
npm run build
```

## 🏆 项目成就

### 技术成就
- ✅ 100% TypeScript 覆盖
- ✅ 完整的响应式设计
- ✅ 双语国际化支持
- ✅ 企业级安全设计
- ✅ 一键部署流程

### 业务价值
- ✅ MVP 产品成功上线
- ✅ 核心功能全部实现
- ✅ 商业化能力就绪
- ✅ 可扩展架构设计

---

🚀 **部署成功！** 网站已在 https://chinesenamefinder.com 上线运行。