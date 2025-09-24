# Supabase OAuth配置修复指南

## 问题说明
Google OAuth登录后重定向到 `localhost:3000` 而不是生产环境域名。

## 原因分析
这是Supabase Dashboard中的Site URL配置问题，不是代码问题。

## 修复步骤

### 1. 登录Supabase Dashboard
访问 https://supabase.com/dashboard 并登录您的账户

### 2. 选择项目
选择项目: `jdwrdqithnxlszlnqfrp`

### 3. 更新认证设置

#### 导航到 Authentication > URL Configuration

设置以下URLs：

**Site URL (重要！这是关键设置):**
```
https://chinesenamefinder.com
```

**Redirect URLs (允许的重定向URLs):**
```
https://chinesenamefinder.com/en/auth/callback
https://chinesenamefinder.com/zh/auth/callback
https://chinesenamefinder.com/en/dashboard
https://chinesenamefinder.com/zh/dashboard
https://chinesenamefinder.com/en/
https://chinesenamefinder.com/zh/
https://chinesenamefinder.com/
```

### 4. 更新Google OAuth设置

#### 在Supabase Dashboard中:
1. 导航到 Authentication > Providers
2. 找到 Google provider
3. 确保已启用
4. 检查Client ID和Client Secret是否正确配置

#### 在Google Cloud Console中:
1. 访问 https://console.cloud.google.com
2. 选择您的项目
3. 导航到 APIs & Services > Credentials
4. 找到您的OAuth 2.0 Client
5. 添加以下Authorized redirect URIs:
```
https://jdwrdqithnxlszlnqfrp.supabase.co/auth/v1/callback
```

### 5. 清除浏览器缓存
1. 清除所有cookies和缓存
2. 或使用隐身/无痕模式测试

### 6. 验证环境变量
确保 Cloudflare Pages 中的环境变量设置正确：
- `NEXT_PUBLIC_SITE_URL` = `https://chinesenamefinder.com`

## 代码已优化
代码中已添加以下改进：
1. 添加了 `getURL()` 函数确保使用正确的站点URL
2. OAuth重定向URL现在会根据环境自动选择
3. 添加了调试日志以便追踪问题

## 测试步骤
1. 完成上述配置后
2. 访问 https://chinesenamefinder.com
3. 点击登录/注册
4. 选择Google登录
5. 应该正确重定向回生产环境

## 常见问题

### Q: 为什么还是重定向到localhost?
A: 检查以下几点：
1. Supabase Dashboard的Site URL设置
2. 浏览器缓存（清除后重试）
3. Google OAuth应用的redirect URIs配置

### Q: 看到"redirect_uri_mismatch"错误?
A: 需要在Google Cloud Console中添加Supabase的回调URL

### Q: 登录成功但页面没有跳转?
A: 检查 `/auth/callback` 页面的处理逻辑

## 紧急修复
如果上述步骤都不能解决问题，可以在代码中硬编码生产URL（不推荐）：

```typescript
// 在 auth-provider.tsx 中
const redirectUrl = 'https://chinesenamefinder.com/zh/auth/callback'
```

但这只是临时解决方案，正确的做法是修复Supabase Dashboard配置。