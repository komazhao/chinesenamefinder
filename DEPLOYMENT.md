# 部署与集成操作手册

> 本文档整合了原 `DEPLOYMENT.md` 与 `SUPABASE_GOOGLE_OAUTH_SETUP.md` 的内容，覆盖本地开发、第三方服务配置、Cloudflare Pages 上线及常见问题排查。完成以下步骤即可从零搭建并上线文化伴侣中文起名网站。

---

## 0. 快速流程总览

1. 准备账号与本地开发环境
2. 创建 Supabase 项目，初始化数据库与认证（含 Google OAuth）
3. 配置 OpenRouter、Stripe 等第三方服务并写入环境变量
4. 在本地跑通 `npm run dev`、`npm run lint`、`npm run type-check`、`npm run build`
5. 推送至 GitHub，使用 Cloudflare Pages 构建并部署，配置自定义域名
6. 根据上线验收清单逐项确认，并持续监控

---

## 1. 必备账号与工具

| 分类 | 说明 | 备注 |
| ---- | ---- | ---- |
| 基础工具 | Node.js >= 18.17、npm >= 8、Git | 推荐使用 Volta 或 nvm 管理 Node 版本 |
| 代码托管 | GitHub | 必须 – Cloudflare Pages 可直接连接仓库 |
| 托管平台 | Cloudflare 账号 | Pages、DNS、SSL |
| 数据与认证 | Supabase 项目 | 提供 Postgres、Auth、Storage |
| AI 引擎 | OpenRouter API Key | 用于名称生成 |
| 支付 | Stripe 账户 | 支付及订阅（先用 Test Mode） |
| 监控（可选） | Sentry、Google Analytics、Uptime Robot | 视需求启用 |

> 💡 建议在团队密码库中集中管理上述密钥，确保最小权限与定期轮换。

---

## 2. 本地环境搭建

### 2.1 克隆与依赖安装

```bash
git clone https://github.com/your-org/chinesenamefinder.git
cd chinesenamefinder
npm install
```

### 2.2 环境变量模板

复制模板并填写各项值：

```bash
cp .env.example .env.local
```

常用环境变量说明（开发环境）：

| 变量 | 必填 | 示例 | 说明 |
| ---- | ---- | ---- | ---- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` | 站点基础 URL |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://xxxx.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | `eyJhbGciOiJI...` | Supabase 公钥（客户端） |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | `eyJhbGciOiJI...` | Supabase Service Role（仅服务器端使用） |
| `OPENROUTER_API_KEY` | ✅ | `or-...` | OpenRouter 密钥 |
| `OPENROUTER_API_URL` | ⭕ | `https://openrouter.ai/api/v1/chat/completions` | 自定义 API Endpoint |
| `STRIPE_SECRET_KEY` | ✅ | `sk_test_...` | Stripe Secret Key（测试） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_test_...` | Stripe Publishable Key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_...` | Stripe Webhook Secret |
| `NEXT_PUBLIC_GA_ID` | ⭕ | `G-XXXXXXX` | Google Analytics（可选） |
| `NEXT_PUBLIC_SENTRY_DSN` | ⭕ | `https://...` | Sentry DSN（可选） |

> ✅ 必填：缺失会导致核心功能失败；⭕ 可选：按需配置。

---

## 3. Supabase 与 Google OAuth 配置

### 3.1 创建项目

1. 登陆 [Supabase Dashboard](https://app.supabase.com)
2. `New Project` → 填写名称（如 `chinesenamefinder`）、强密码、选择靠近用户的区域
3. 记录 `Project URL`、`Anon Key`、`Service Role Key`

### 3.2 初始化数据库

在 Supabase SQL Editor 中执行项目内 `lib/database-schema.sql` 内容：

```sql
-- 上传/粘贴文件内容并运行
-- 验证主要表存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles','names','payments','usage_analytics');
```

确认行级安全（Row Level Security）在上述表上已启用。

### 3.3 认证基础设置

`Authentication → Settings`：

- **Site URL**：`http://localhost:3000`
- **Redirect URLs**：
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/en/auth/callback`
  - `http://localhost:3000/zh/auth/callback`
  - `https://your-domain.com/auth/callback`
- **Email Auth**：启用邮箱注册、推荐启用邮箱确认

### 3.4 Google OAuth 详细步骤

1. **Google Cloud 项目**：在 [Google Cloud Console](https://console.cloud.google.com) 创建或选择项目
2. **启用 API**：`APIs & Services → Library` 搜索并启用 *Google People API*（Google+ API 已弃用，People API 可返回基本信息）
3. **OAuth 同意屏幕**：设置应用名称、支持邮箱、隐私政策/服务条款链接，添加 `.../auth/userinfo.email` 与 `.../auth/userinfo.profile` 范围，若未发布需添加测试用户
4. **创建 OAuth Client**：`Credentials → Create Credentials → OAuth client ID`
   - 类型：`Web application`
   - Authorized JavaScript origins：`http://localhost:3000`、`https://your-domain.com`
   - Authorized redirect URIs：`https://xxxx.supabase.co/auth/v1/callback`、`http://localhost:3000/auth/callback`、`https://your-domain.com/auth/callback`
   - 记录 Client ID / Client Secret
5. **回到 Supabase**：`Authentication → Providers → Google`
   - 启用 Google，填入 Client ID 与 Client Secret

### 3.5 连接测试

在项目根目录执行：

```bash
# 检查 Supabase REST 接口可用性
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"

# 验证 Google OAuth 回调 URL 是否生效
open "https://accounts.google.com/o/oauth2/v2/auth?client_id=$GOOGLE_CLIENT_ID&redirect_uri=$NEXT_PUBLIC_SUPABASE_URL/auth/v1/callback&response_type=code&scope=openid%20email%20profile"
```

若能跳转到授权页面即配置成功。

---

## 4. 第三方服务配置

### 4.1 OpenRouter API 设置

1. 访问 [OpenRouter Dashboard](https://openrouter.ai/keys) 创建 API Key。
2. 在 **Billing** 页面设置额度提醒，避免意外费用（建议按照日/月预算填写）。
3. 建议额外设置以下环境变量：
   - `OPENROUTER_API_URL`（可选）：自定义请求地址，默认 `https://openrouter.ai/api/v1/chat/completions`。
   - `OPENROUTER_MODEL`（可选）：默认使用 `openai/gpt-4o-mini`。
   - `OPENROUTER_APP_NAME`（可选）：会作为 `X-Title` 发送给 OpenRouter，默认 `Chinese Name Finder`。
4. 测试连通性：

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### 4.2 Stripe

1. 切换到 Test Mode，复制 `Publishable key` 与 `Secret key`
2. `Developers → Webhooks` 新建 Endpoint：`https://your-domain.com/api/stripe-webhook`，监听 checkout/payment/subscription 相关事件
3. 记录 Webhook Secret，写入 `.env.local`
4. 使用测试卡 `4242 4242 4242 4242 / 12-34 / 123` 验证支付流程
    > 当前暂无 Stripe 账号时，可先跳过实际支付配置。前端购买按钮会提示“该功能即将上线，敬请期待”，不会发起真实支付。

### 4.3 可选服务

| 服务 | 配置位置 | 备注 |
| ---- | -------- | ---- |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN` | 安装后自动捕获错误 |
| Google Analytics | `NEXT_PUBLIC_GA_ID` | 可通过 Cloudflare + GA 双重监控 |
| UptimeRobot | 配置 HTTP 监控 `https://your-domain.com/api/health` | 保证可用性报警 |

---

## 5. 本地开发与测试流程

1. **启动开发环境**
   ```bash
   npm run dev
   open http://localhost:3000
   ```
2. **代码质量检查**
   ```bash
   npm run lint
   npm run type-check
   ```
   > 💡 `npm run lint` 会调用 Next.js 自带的 `next lint`，命令仍可正常运行，但控制台会提示该子命令将在 Next.js 16 版本弃用，可在后续迁移到 ESLint CLI。
3. **构建自测**
   ```bash
   npm run build
   ```
   - Cloudflare Pages 构建期间需要访问 Google Fonts；若构建环境无法联网，可临时设置 `NEXT_FONT_GOOGLE_ENABLE=0` 并改用自托管字体，或手动预下载字体后改用 `next/font/local`
4. **关键功能手动验证**
   - 多语言路由切换（/en、/zh）
   - 邮箱注册 / 登录、Google OAuth 登录
   - AI 起名、收藏、控制台统计
   - Stripe 购买流程（Test Mode）
   - 反馈入口 `/contact` 与用户资料更新

> 建议使用 Supabase Dashboard 删除测试数据，保持数据库整洁。

---

## 6. Cloudflare Pages 部署

### 6.1 将域名托管到 Cloudflare（一次性操作）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) 后，在顶部导航选择 **Websites → Add a site**。
2. 输入已购买的域名（例如 `chinesenamefinder.com`），选择 **Free** 计划继续。
3. Cloudflare 会生成两条新的域名服务器（Nameserver），前往域名注册商后台替换为 Cloudflare 提供的记录。
4. 等待 DNS 生效（通常 5-30 分钟），在 Cloudflare 网站列表中看到状态 `Active` 即表示托管成功。

> 域名迁移完成后，后续的 DNS、SSL 等都可以在 Cloudflare 中配置，无需再回到原注册商。

### 6.2 通过 Workers & Pages 部署静态站点

1. 代码准备好后推送到 GitHub：`git push origin main`
2. Cloudflare Dashboard → 左侧导航选择 **Workers & Pages → Pages** → 点击 **Create application**。
3. 选择 **Connect to Git**，授权 Cloudflare 访问 GitHub 仓库，并选择 `chinesenamefinder` 这个仓库及要部署的分支（通常是 `main`）。
4. 在构建设置中填写：
   - **Framework preset**：`Next.js`
   - **Build command**：`npm install && npm run build && npx @cloudflare/next-on-pages --experimental-minify`
   - **Build output directory**：`.vercel/output/static`
   - **Root directory**：`/`
5. 点击 **Save and Deploy** 触发第一次构建，首次安装依赖会稍慢。

> 之后每次向目标分支推送代码，Cloudflare Pages 都会自动构建并发布最新版本。

### 6.3 配置 Environment variables

1. 打开 Pages 项目 → **Settings → Environment variables**。
2. 分别在 `Production` 与 `Preview` 标签页下添加变量（键值与 `.env.local` 对应）。建议结构如下：

| Key | Production | Preview |
| --- | ---------- | ------- |
| `APP_STAGE` | `production` | `preview` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | `https://<preview>.pages.dev` |
| `NEXT_PUBLIC_SUPABASE_URL` | 生产 Supabase URL | 同上（或测试项目） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 生产 Anon Key | 测试 Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | 生产 Service Role | 测试 Service Role |
| `OPENROUTER_API_KEY` | 生产密钥 | 测试/受限密钥 |
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | 生产 Webhook | 测试 Webhook |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` |
| 可选监控变量 | 按需填写 | 按需填写 |

### 6.4 绑定 Pages 与自定义域名

1. 在 Cloudflare Dashboard 中打开目标 Pages 项目。
2. 进入 **Custom domains → Set up a domain**，点击 `Select domain`，从弹窗中选择刚才托管的域名。
3. 可以先绑定 `www.chinesenamefinder.com` 等子域名；如需让裸域（`chinesenamefinder.com`）指向同一站点，在 **Custom domains → Add domain** 中选择 `Root` 选项并确认。
4. Cloudflare 会自动为这些域名创建 `CNAME`/`A` 记录，状态转为绿色 `Active` 即生效。如需查看具体 DNS，可在 **Websites → {domain} → DNS** 中确认记录指向 `your-project-name.pages.dev`。
5. 初次绑定会自动申请 SSL 证书，平均 5-10 分钟内完成；如浏览器仍显示证书无效，可尝试清除缓存或等待完全传播。

> 若希望把 `www` 重定向到裸域（或反向），可以在 **Websites → {domain} → Rules → Bulk redirects** 中添加 301 重定向规则。

### 6.5 管理部署

1. 每次推送到绑定分支会自动触发部署，可在 Pages 项目首页查看构建状态及预览链接。
2. 如果需要手动回滚，进入 **Deployments** 列表，选择某次构建并点击 `Rollback`。
3. 修改环境变量后必须点击 `Save and deploy` 重新构建，变更才会生效。
4. 日常监控可借助 Pages 提供的 **Analytics** 或 Cloudflare 主面板的请求统计。

### 6.4 Wrangler CLI 手动部署（可选）

```bash
npm install -g wrangler
wrangler login
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name chinesenamefinder
```

> 手动部署适用于预发布验证或 CI/CD 之外的紧急更新。

---

## 7. 上线验收与监控

### 7.1 功能验收清单

- [ ] 首页与多语言路由正常
- [ ] 认证流程（邮箱、Google OAuth）完整
- [ ] AI 名字生成、收藏、控制台统计正确
- [ ] Stripe 支付成功并在 Supabase `payments` 表落库
- [ ] `/api/health` 返回 `200`，无跨域错误
- [ ] 样式、字体、SEO 元信息与 OG 标签加载正常
- [ ] 监控（Sentry/GA/Uptime Robot）开始接收数据

### 7.2 自动化 Smoke Test（示例）

```bash
#!/bin/bash
DOMAIN="https://your-domain.com"
set -e

curl -fsSL "$DOMAIN/api/health" >/dev/null
echo "✅ Health OK"

curl -I "$DOMAIN" | grep -i "HTTP/2 200" >/dev/null && echo "✅ Home OK"

curl -fsSL -X POST "$DOMAIN/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","gender":"neutral"}' | jq '.status'
```

> 将脚本加入 CI 或定期任务，可及时发现故障。

---

## 8. 常见问题排查

| 场景 | 现象 | 解决方案 |
| ---- | ---- | -------- |
| Supabase 连接失败 | `connection refused` / 404 | 检查 URL、Anon Key；确认 IP 未被防火墙阻挡，可用 `curl` 验证 |
| Google 登录报 `redirect_uri_mismatch` | 授权页提示 400 | 确保 Google Console & Supabase 中的回调 URI 完全匹配（含协议与末尾斜杠） |
| `npm run build` 期间拉取字体失败 | Cloudflare Pages 构建报 `Failed to fetch Inter/Noto` | 允许构建环境访问外网，或设置 `NEXT_FONT_GOOGLE_ENABLE=0` 后改用 `next/font/local` 自托管字体 |
| OpenRouter `429`/额度超限 | AI 接口报错 | 在 OpenRouter Billing 设置额度上限并监控 `usage`，在服务端增加限流逻辑 |
| Stripe Webhook 校验失败 | 日志出现 `Signature verification failed` | 确认 Webhook Secret、确保使用原始请求体（`request.text()`），Stripe CLI 可用于本地调试 |
| Cloudflare Preview 正常但 Production 404 | 自定义域名解析异常 | 检查 DNS CNAME 指向 `pages.dev`，确认 SSL 状态为 Active |

---

## 9. 维护建议

- 每月检查依赖更新：`npm update`、`npm audit fix`
- 使用 Supabase Scheduled Functions 清理过期数据（会话、临时起名记录）
- 定期导出数据库备份并存储于加密对象存储
- 对核心密钥（OpenRouter、Stripe、Service Role）设置 90 天轮换计划
- 遇到紧急故障先回滚上一稳定版本，再定位问题源码

---

若需进一步协助，可在 GitHub Issues 中提交问题或通过团队支持渠道联系。
