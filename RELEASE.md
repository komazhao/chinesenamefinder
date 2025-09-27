# 📦 ChineseNameHub 发版指南

## 🎯 发版概述

本文档详细说明了 ChineseNameHub 项目的发版流程、最佳实践和注意事项。

## 🚀 快速开始

### 一键发版（推荐）

```bash
npm run deploy
```

这个命令会自动完成所有发版步骤，包括代码检查、构建、SEO更新和部署。

## 📋 发版前准备

### 1. 代码准备
- [ ] 确保所有功能开发完成
- [ ] 所有 bug 已修复
- [ ] 代码已通过 review
- [ ] 本地测试通过

### 2. 环境检查
```bash
# 检查 Node.js 版本（需要 >= 18.17.0）
node --version

# 检查环境变量配置
cat .env.local

# 检查当前分支
git branch --show-current
```

### 3. 依赖更新（可选）
```bash
# 检查过期的依赖
npm outdated

# 更新依赖（谨慎操作）
npm update

# 安装依赖
npm ci --legacy-peer-deps
```

## 📝 版本管理

### 版本号规则

遵循语义化版本规范（Semantic Versioning）：
- **主版本号**（MAJOR）：不兼容的 API 修改
- **次版本号**（MINOR）：向下兼容的功能新增
- **修订号**（PATCH）：向下兼容的问题修复

### 更新版本号

```bash
# 修订版本（bug 修复）
npm version patch

# 次版本（新功能）
npm version minor

# 主版本（重大更新）
npm version major
```

## 🔄 发版流程详解

### 步骤 1：代码质量检查

```bash
# TypeScript 类型检查
npm run type-check

# ESLint 代码检查
npm run lint

# 修复可自动修复的问题
npm run lint -- --fix
```

### 步骤 2：本地测试

```bash
# 启动开发服务器测试
npm run dev

# 测试核心功能：
# - 用户注册/登录
# - AI 起名生成
# - 支付流程
# - 多语言切换
```

### 步骤 3：构建测试

```bash
# 本地构建测试
npm run build

# Cloudflare 构建测试
npm run build:opennext
```

### 步骤 4：SEO 更新

发版脚本会自动更新以下 SEO 相关内容：
- ✅ sitemap.xml - 网站地图
- ✅ robots.txt - 爬虫规则
- ✅ 构建信息 - 版本和时间戳

### 步骤 5：执行发版

```bash
# 运行一键发版脚本
npm run deploy
```

脚本执行流程：
1. 环境配置验证
2. 依赖安装
3. 代码质量检查
4. 版本信息更新
5. 生产环境构建
6. Git 提交（可选）
7. 推送到远程（可选）
8. 触发自动部署

### 步骤 6：部署验证

部署完成后，进行以下验证：

#### 基础功能验证
- [ ] 访问 https://chinesenamefinder.com 确认网站正常
- [ ] 测试中英文切换
- [ ] 测试用户登录/注册
- [ ] 测试 AI 起名功能
- [ ] 测试支付流程（沙盒环境）

#### SEO 验证
- [ ] 检查 https://chinesenamefinder.com/sitemap.xml
- [ ] 检查 https://chinesenamefinder.com/robots.txt
- [ ] Google Analytics 实时数据确认

#### 性能验证
- [ ] 使用 PageSpeed Insights 测试性能
- [ ] 检查 Core Web Vitals 指标
- [ ] 验证移动端响应式布局

## 🔥 热修复流程

当生产环境出现紧急问题时：

### 1. 创建热修复分支
```bash
git checkout -b hotfix/issue-description
```

### 2. 修复问题
```bash
# 进行必要的代码修改
# 本地测试验证
npm run dev
```

### 3. 快速部署
```bash
# 使用发版脚本
npm run deploy

# 或手动部署
git add .
git commit -m "hotfix: description"
git push origin hotfix/issue-description
```

### 4. 合并到主分支
```bash
# 创建 PR 并合并到 main
# 或直接合并（紧急情况）
git checkout main
git merge hotfix/issue-description
git push origin main
```

## 📊 发版后监控

### 监控清单
- **Cloudflare Analytics** - 流量和性能
- **Google Analytics** - 用户行为
- **Supabase Dashboard** - 数据库和 API
- **浏览器控制台** - 前端错误

### 关键指标
- 页面加载时间 < 3s
- API 响应时间 < 2s
- 错误率 < 0.1%
- 可用性 > 99.9%

## 🔙 回滚策略

如果发版后出现严重问题：

### Cloudflare Pages 回滚
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择项目 → Deployments
3. 找到上一个稳定版本
4. 点击 "Rollback" 回滚

### Git 回滚
```bash
# 查看提交历史
git log --oneline -10

# 回滚到指定版本
git revert HEAD
git push origin main

# 或强制回滚（谨慎使用）
git reset --hard <commit-hash>
git push --force origin main
```

## 📝 发版记录

建议在每次发版后记录：

### 发版模板
```markdown
## 版本 x.x.x - YYYY-MM-DD

### 新功能
- 功能 1
- 功能 2

### 改进
- 改进 1
- 改进 2

### 修复
- Bug 1
- Bug 2

### 部署信息
- 部署时间：YYYY-MM-DD HH:MM
- 部署人员：姓名
- 验证状态：✅ 通过
```

## 🛠️ 故障排查

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存
rm -rf .next .open-next node_modules
npm ci --legacy-peer-deps
npm run build:opennext
```

#### 2. 环境变量问题
```bash
# 检查环境变量
cat .env.local
cat wrangler.toml

# 验证环境变量
npm run validate-env
```

#### 3. 部署超时
```bash
# 使用手动部署
npm run build:opennext
npx wrangler pages deploy .open-next
```

## 📞 紧急联系

发版出现问题时的联系方式：
- **技术负责人**：[联系方式]
- **Cloudflare 支持**：[支持链接]
- **Supabase 支持**：[支持链接]

## 📚 相关文档

- [README.md](./README.md) - 项目概述
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署配置
- [SITE_ARCHITECTURE.md](./SITE_ARCHITECTURE.md) - 网站架构

## ✅ 发版检查清单

发版前最终检查：
- [ ] 代码已提交到 Git
- [ ] 所有测试通过
- [ ] 环境变量配置正确
- [ ] 版本号已更新
- [ ] 文档已更新
- [ ] 团队已通知

---

最后更新：2024年
作者：ChineseNameHub Team