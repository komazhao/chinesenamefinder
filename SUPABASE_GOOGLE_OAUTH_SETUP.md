# Supabase 和 Google OAuth 配置指南

本文档详细说明如何配置 Supabase 和 Google OAuth，以使您的应用支持邮箱注册和 Google 第三方登录功能。

## 目录

1. [Supabase 配置](#1-supabase-配置)
2. [Google OAuth 配置](#2-google-oauth-配置)
3. [环境变量配置](#3-环境变量配置)
4. [常见问题排查](#4-常见问题排查)

---

## 1. Supabase 配置

### 1.1 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **项目名称**：`chinesenamefinder` 或您喜欢的名称
   - **数据库密码**：设置一个强密码（请妥善保存）
   - **地区**：选择离您用户最近的地区（例如：亚太地区）
   - **定价方案**：选择适合的方案（Free tier 足够开发使用）

### 1.2 获取 API 密钥

1. 在项目主页，点击左侧菜单的 **Settings** → **API**
2. 记录以下信息：
   - **Project URL**：`https://xxxxx.supabase.co`
   - **Anon key (public)**：用于客户端的公开密钥
   - **Service role key**：用于服务端的私有密钥（保密）

### 1.3 配置认证设置

1. 进入 **Authentication** → **Settings**
2. 在 **General Settings** 中配置：
   ```
   Site URL: http://localhost:3000
   Redirect URLs:
   - http://localhost:3000/auth/callback
   - http://localhost:3000/en/auth/callback
   - http://localhost:3000/zh/auth/callback
   - https://yourdomain.com/auth/callback（生产环境）
   ```

3. 在 **Email Auth** 部分：
   - ✅ 启用 **Enable Email Signup**
   - ✅ 启用 **Enable Email Confirmations**（建议）
   - 配置邮件模板（可选）

### 1.4 数据库表设置

运行以下 SQL 创建必要的表（在 SQL Editor 中执行）：

```sql
-- 创建用户配置文件表
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建行级安全策略
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 允许用户读取自己的配置文件
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 允许用户更新自己的配置文件
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 创建触发器，在用户注册时自动创建配置文件
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 2. Google OAuth 配置

### 2.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 记录 **Project ID**

### 2.2 启用 Google+ API

1. 在左侧菜单选择 **APIs & Services** → **Library**
2. 搜索 "Google+ API"
3. 点击并启用该 API

### 2.3 配置 OAuth 同意屏幕

1. 进入 **APIs & Services** → **OAuth consent screen**
2. 选择用户类型：
   - **Internal**：仅限组织内用户（需要 Google Workspace）
   - **External**：所有 Google 用户（推荐）
3. 填写应用信息：
   - **应用名称**：文化伴侣 / Cultural Companion
   - **用户支持邮箱**：您的邮箱地址
   - **应用 Logo**：上传应用图标（可选）
   - **应用域名**：您的域名
   - **隐私政策链接**：`https://yourdomain.com/privacy`
   - **服务条款链接**：`https://yourdomain.com/terms`
4. 添加范围（Scopes）：
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. 添加测试用户（如果选择 External 且应用未发布）

### 2.4 创建 OAuth 2.0 客户端 ID

1. 进入 **APIs & Services** → **Credentials**
2. 点击 **+ CREATE CREDENTIALS** → **OAuth client ID**
3. 选择应用类型：**Web application**
4. 配置信息：
   - **名称**：Cultural Companion Web Client
   - **授权的 JavaScript 来源**：
     ```
     http://localhost:3000
     https://yourdomain.com
     https://xxxxx.supabase.co
     ```
   - **授权的重定向 URI**：
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```
5. 创建后记录：
   - **Client ID**：`xxxxx.apps.googleusercontent.com`
   - **Client Secret**：`GOCSPX-xxxxx`（保密）

### 2.5 在 Supabase 中配置 Google OAuth

1. 返回 Supabase Dashboard
2. 进入 **Authentication** → **Providers**
3. 找到 **Google** 并启用
4. 填写从 Google Cloud Console 获取的：
   - **Client ID**
   - **Client Secret**
5. 保存配置

---

## 3. 环境变量配置

在项目根目录的 `.env.local` 文件中配置：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth (可选，如果需要在客户端使用)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## 4. 常见问题排查

### 4.1 邮箱注册问题

**问题**：注册后没有收到确认邮件
- **解决方案**：
  1. 检查垃圾邮件文件夹
  2. 在 Supabase Dashboard → Authentication → Settings 中禁用邮件确认（开发阶段）
  3. 配置自定义 SMTP（生产环境）

**问题**：注册时报错 "User already registered"
- **解决方案**：
  1. 检查该邮箱是否已注册
  2. 在 Supabase Dashboard → Authentication → Users 中查看用户列表

### 4.2 Google OAuth 问题

**问题**：点击 Google 登录后显示 "Error 400: redirect_uri_mismatch"
- **解决方案**：
  1. 确保 Google Console 中的重定向 URI 包含：
     - `https://xxxxx.supabase.co/auth/v1/callback`
  2. 检查 URI 是否完全匹配（包括 http/https 和尾部斜杠）

**问题**：Google 登录后未能正确重定向
- **解决方案**：
  1. 确保创建了 `/auth/callback` 页面
  2. 检查 Supabase 的 Site URL 配置是否正确
  3. 确认重定向 URL 在 Supabase 的白名单中

**问题**：Google 登录显示 "Access blocked: This app's request is invalid"
- **解决方案**：
  1. 确保 OAuth 同意屏幕已配置完整
  2. 如果是 External 类型，添加测试用户邮箱
  3. 考虑发布应用（需要 Google 审核）

### 4.3 本地开发问题

**问题**：localhost:3000 无法访问
- **解决方案**：
  1. 确保使用 `npm run dev` 启动项目
  2. 检查端口 3000 是否被占用：`lsof -i :3000`
  3. 修改 `package.json` 中的启动命令：
     ```json
     "dev": "next dev -p 3000"
     ```

### 4.4 生产环境部署

部署到生产环境时，需要更新以下配置：

1. **Supabase Dashboard**：
   - Site URL：`https://yourdomain.com`
   - Redirect URLs：添加生产环境 URL

2. **Google Cloud Console**：
   - 添加生产域名到授权来源和重定向 URI

3. **环境变量**：
   - 更新 `NEXT_PUBLIC_SITE_URL` 为生产域名

---

## 5. 测试检查清单

- [ ] 邮箱注册功能正常
- [ ] 邮箱登录功能正常
- [ ] Google 登录按钮可点击
- [ ] Google OAuth 流程完整（授权 → 回调 → 登录成功）
- [ ] 用户信息正确保存到数据库
- [ ] 登出功能正常
- [ ] Session 持久化正常

---

## 6. 安全建议

1. **永远不要**在客户端代码中暴露 Service Role Key
2. 使用环境变量管理敏感信息
3. 启用 Supabase 的行级安全（RLS）
4. 定期更新依赖包
5. 使用 HTTPS（生产环境）
6. 配置适当的 CORS 策略
7. 实施速率限制

---

## 7. 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Next.js 认证最佳实践](https://nextjs.org/docs/authentication)

如有问题，请参考官方文档或联系技术支持。