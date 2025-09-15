# 🤝 贡献指南

欢迎为文化伴侣项目贡献代码！本文档将指导您如何参与项目开发。

## 📋 目录

- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交流程](#提交流程)
- [问题反馈](#问题反馈)
- [功能建议](#功能建议)

## 🛠️ 开发环境设置

### 前置要求

- Node.js >= 18.17.0
- npm >= 8.0.0
- Git 最新版本

### 快速开始

1. **Fork 并克隆仓库**
```bash
# Fork 项目到您的 GitHub 账户
# 然后克隆您的 fork
git clone https://github.com/YOUR_USERNAME/chinesenamefinder.git
cd chinesenamefinder

# 添加上游仓库
git remote add upstream https://github.com/original-org/chinesenamefinder.git
```

2. **运行设置脚本**
```bash
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

3. **配置环境变量**
```bash
# 编辑 .env.local 文件
cp .env.example .env.local
# 配置必要的 API 密钥
```

4. **启动开发服务器**
```bash
npm run dev
```

## 📝 代码规范

### TypeScript 规范

```typescript
// ✅ 好的示例
interface UserProfile {
  id: string
  email: string
  displayName: string | null
  createdAt: string
}

// 使用明确的类型
const fetchUser = async (userId: string): Promise<UserProfile | null> => {
  // 实现
}

// ❌ 避免的写法
const fetchUser = async (userId: any): Promise<any> => {
  // 实现
}
```

### 组件规范

```tsx
// ✅ 好的组件结构
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### 样式规范

```tsx
// ✅ 使用 Tailwind CSS 工具类
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">标题</h3>
  <Button variant="primary" size="sm">按钮</Button>
</div>

// ✅ 使用 cn 函数合并类名
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}>
```

### API 路由规范

```typescript
// ✅ 标准的 API 路由结构
export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const user = await authenticateUser(request)

    // 2. 验证请求数据
    const data = await validateRequestData(request)

    // 3. 执行业务逻辑
    const result = await executeBusinessLogic(data, user)

    // 4. 返回结果
    return NextResponse.json({ success: true, data: result })

  } catch (error) {
    // 5. 错误处理
    return handleAPIError(error)
  }
}
```

## 🔄 提交流程

### 分支策略

```bash
# 从最新的 main 分支创建功能分支
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/issue-description
```

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能开发
git commit -m "feat: add AI name generation with cultural context"
git commit -m "feat(auth): implement Google OAuth integration"

# 问题修复
git commit -m "fix: resolve payment webhook signature verification"
git commit -m "fix(ui): correct mobile responsive layout issues"

# 文档更新
git commit -m "docs: add API documentation for name generation"

# 样式调整
git commit -m "style: improve Chinese typography spacing"

# 重构
git commit -m "refactor: extract name generation logic to separate module"

# 测试
git commit -m "test: add unit tests for OpenAI integration"

# 构建相关
git commit -m "chore: update dependencies to latest versions"
```

### 提交前检查

```bash
# 运行完整的检查
npm run pre-commit

# 包含以下步骤：
npm run type-check    # TypeScript 类型检查
npm run lint         # 代码规范检查
npm run lint --fix   # 自动修复格式问题
npm run build        # 构建检查
```

### 创建 Pull Request

1. **推送分支**
```bash
git push origin feature/your-feature-name
```

2. **创建 PR 模板**
```markdown
## 📝 改动说明
简要描述此次改动的内容和目的

## 🎯 相关问题
- Closes #123
- Related to #456

## 🧪 测试步骤
1. 步骤一
2. 步骤二
3. 验证结果

## ✅ 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 通过了所有检查

## 📷 截图 (如适用)
<!-- 添加前后对比截图 -->

## 💭 其他说明
<!-- 任何需要特别说明的内容 -->
```

## 🐛 问题反馈

### Bug 报告

使用以下模板报告 Bug：

```markdown
**🐛 Bug 描述**
清晰描述遇到的问题

**🔄 重现步骤**
1. 访问 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**✅ 预期行为**
描述您期望发生的情况

**📱 环境信息**
- 操作系统: [例如 iOS, Windows, macOS]
- 浏览器: [例如 Chrome 96, Safari 15]
- 设备: [例如 iPhone 13, Desktop]
- 版本: [例如 v1.2.0]

**📷 截图**
如果适用，添加截图有助于解释问题

**💭 其他说明**
添加任何其他相关信息
```

### 安全问题

⚠️ **请勿公开报告安全问题**

发送邮件至 security@culturecompanion.com，包含：
- 详细的问题描述
- 重现步骤
- 可能的影响范围
- 建议的修复方案（如有）

## 💡 功能建议

### 功能请求模板

```markdown
**🌟 功能描述**
清楚简洁地描述您希望添加的功能

**💭 问题或需求**
这个功能解决什么问题？为什么需要这个功能？

**💡 解决方案**
描述您希望看到的实现方式

**🔄 替代方案**
描述您考虑过的其他解决方案

**📋 额外说明**
添加任何其他相关信息、截图或参考资料
```

## 📚 开发指南

### 添加新功能

1. **规划阶段**
   - 在 Issues 中讨论功能需求
   - 确认技术方案和实现路径
   - 考虑对现有功能的影响

2. **开发阶段**
   - 创建功能分支
   - 编写代码并遵循规范
   - 添加适当的测试
   - 更新相关文档

3. **测试阶段**
   - 本地测试所有功能
   - 检查代码覆盖率
   - 确保没有破坏现有功能

4. **提交阶段**
   - 创建 Pull Request
   - 通过代码审查
   - 合并到主分支

### 数据库变更

如果需要修改数据库结构：

1. **编写迁移脚本**
```sql
-- migrations/2024_01_15_add_user_preferences.sql
ALTER TABLE user_profiles
ADD COLUMN preferences JSONB DEFAULT '{}';

CREATE INDEX idx_user_profiles_preferences
ON user_profiles USING GIN(preferences);
```

2. **更新类型定义**
```typescript
// lib/database.types.ts
export interface UserProfile {
  // 现有字段...
  preferences: Json | null // 新增字段
}
```

3. **测试迁移**
```bash
# 在开发环境测试迁移
npm run db:migrate

# 验证数据完整性
npm run db:validate
```

## 🎯 最佳实践

### 性能优化

- 使用 `React.memo` 优化组件渲染
- 实现适当的缓存策略
- 优化数据库查询
- 压缩和优化静态资源

### 安全考虑

- 验证所有用户输入
- 使用环境变量存储敏感信息
- 实施适当的访问控制
- 定期更新依赖项

### 可访问性

- 使用语义化 HTML
- 提供适当的 ARIA 标签
- 确保键盘导航支持
- 保持合适的颜色对比度

## 🏆 贡献者认可

所有贡献者都会在以下位置获得认可：

- README.md 贡献者列表
- CHANGELOG.md 版本更新记录
- 项目网站贡献者页面

## 📞 联系方式

- 💬 讨论: [GitHub Discussions](https://github.com/your-org/chinesenamefinder/discussions)
- 📧 邮箱: developers@culturecompanion.com
- 💼 LinkedIn: [Culture Companion](https://linkedin.com/company/culture-companion)

---

感谢您对文化伴侣项目的贡献！🎉

每一个贡献都让这个项目更加完善，帮助更多人找到属于自己的中文名字。