# Veloform 项目开发指南

## 目的
本文档定义 Veloform 项目的协作流程、开发工作流和团队规范。技术架构和详细编码规范请参阅 [openspec 文档](./openspec/README.md)。

## 目录
- [快速开始](#快速开始)
- [开发工作流](#开发工作流)
- [协作规范](#协作规范)
- [文档体系](#文档体系)

---

## 快速开始

### 本地开发环境设置

1. **克隆仓库**：
   ```bash
   git clone https://github.com/sutchan/Veloform.git
   cd Veloform
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```

3. **配置环境变量**：
   ```bash
   cp .env.example .env
   # 编辑 .env 填入 Firebase 配置
   ```

4. **启动开发服务器**：
   ```bash
   npm run dev
   ```

5. **访问应用**：
   - 浏览器打开 `http://localhost:3000`

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发服务器（端口 3000） |
| `npm run build` | 生产构建 |
| `npm run test` | 执行单元测试 |
| `npm run lint` | ESLint 代码检查 |
| `npm run watch` | 开发模式构建并监听 |
| `npm run serve:ssr:app` | 运行 SSR 服务 |

---

## 开发工作流

### 分支策略

**主分支**：
- `main` - 稳定版本，所有部署来自此分支

**功能分支命名**：
```
feature/<描述>     - 新功能开发
fix/<描述>         - Bug 修复
docs/<描述>        - 文档更新
hotfix/<描述>      - 紧急修复
refactor/<描述>    - 代码重构
```

**示例**：
- `feature/add-suspension-selector`
- `fix/firebase-auth-error-handling`
- `docs/update-api-specification`

### 提交流程

1. **从 main 创建分支**：
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/my-new-feature
   ```

2. **开发与提交**：
   ```bash
   # 编写代码...
   git add .
   git commit -m "feat(components): add suspension selector"
   ```

3. **推送到远程**：
   ```bash
   git push origin feature/my-new-feature
   ```

4. **创建 Pull Request**

### 提交信息规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <简短描述>

[可选的详细描述]

[可选的 footer]
```

**Type 类型**：
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `style` - 代码格式（不影响逻辑）
- `refactor` - 重构
- `test` - 测试相关
- `chore` - 构建/配置等杂项

**示例**：
```
feat(components): add MTB suspension selector

- Add SuspensionCategory enum
- Update component-selector modal
- Filter components by bikeType

Closes #123
```

---

## 协作规范

### Pull Request 流程

**创建 PR 前检查**：
- [ ] 所有测试通过 (`npm run test`)
- [ ] Lint 检查通过 (`npm run lint`)
- [ ] 构建成功 (`npm run build`)
- [ ] 更新了相关文档
- [ ] 提交信息符合规范

**PR 描述模板**：
```markdown
## 变更摘要
简要描述本次变更的目的和内容

## 测试方式
1. 步骤一
2. 步骤二
3. 预期结果

## 关联 Issue
Closes #123

## 截图（如适用）
[添加截图]
```

**审核要求**：
- 至少一位团队成员审核通过
- 所有评论已解决
- CI 检查全部通过

### 代码审查要点

Reviewer 应关注：
1. **功能正确性**：是否实现了需求
2. **代码质量**：是否符合编码规范
3. **测试覆盖**：是否有足够的测试
4. **性能影响**：是否引入性能问题
5. **安全性**：是否有安全漏洞
6. **可维护性**：代码是否清晰易懂

---

## 文档体系

Veloform 采用分层文档体系：

### 规范文档 (openspec/)

详细的技术规范和开发指南：

- **[openspec/README.md](./openspec/README.md)** - 规范索引入口
- **架构规范** - 架构设计、数据流、组件设计
- **API 规范** - Firestore 接口、数据模型
- **开发规范** - 编码标准、测试规范
- **部署规范** - 环境配置、部署流程

### 项目文档 (根目录)

面向用户和贡献者的高层文档：

- **[README.md](./README.md)** / **[README_CN.md](./README_CN.md)** - 项目概述
- **[PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md)** - 本开发指南
- **[CHANGELOG.md](./CHANGELOG.md)** - 版本变更历史
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - 改进记录

### 何时更新文档

| 变更类型 | 需更新的文档 |
|---------|-------------|
| 新功能 | CHANGELOG.md, 相关 API 文档 |
| Bug 修复 | CHANGELOG.md |
| 架构调整 | openspec 架构文档 |
| API 变更 | openspec API 文档 |
| 部署流程变化 | openspec 部署文档 |
| 规范调整 | PROJECT_GUIDELINES.md, openspec 开发规范 |

---

## 编码规范快速参考

详细的编码规范请参阅 [openspec/development/coding-standards.md](./openspec/development/coding-standards.md)。以下是核心要点：

### TypeScript
- 避免使用 `any`，使用明确类型
- 导出函数和类必须标注返回类型
- 使用泛型增强类型安全

### Angular
- 所有组件使用 standalone + OnPush
- 优先使用 Signal-based 状态管理
- 使用 `inject()` 进行依赖注入

### 样式
- 使用 Tailwind CSS 实用类
- 移动优先响应式设计
- 支持暗色模式

### 测试
- 新功能必须配套单元测试
- 测试覆盖率目标：≥80%
- 测试文件命名：`*.spec.ts`

详细规范见 [openspec 开发规范](./openspec/development/coding-standards.md)

---

## 测试要求

**基本要求**：
- 新功能必须配套单元测试
- Bug 修复应补充回归测试
- 测试文件与被测文件同目录

**覆盖率目标**：
- 语句覆盖率: ≥ 80%
- 分支覆盖率: ≥ 75%
- 函数覆盖率: ≥ 85%

**运行测试**：
```bash
npm run test           # 运行测试
npm run test -- --coverage  # 生成覆盖率报告
```

详细测试规范见 [openspec 测试规范](./openspec/development/testing.md)

---

## 环境配置

### 环境变量管理

**重要**：所有私密配置不应提交到仓库。

1. **复制模板**：
   ```bash
   cp .env.example .env
   ```

2. **填写配置**：
   编辑 `.env` 文件，填入 Firebase 配置

3. **Git 忽略**：
   `.gitignore` 已配置忽略 `.env*` 文件

### Firebase 配置获取

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 > Project Settings
3. 在 "Your apps" 中找到 Web App 配置
4. 复制对应值到 `.env` 文件

---

## 常见问题

### Q: 如何调试 SSR 问题？

A: Three.js 和 DOM 操作需要平台检查：
```typescript
if (isPlatformBrowser(this.platformId)) {
  // Browser-only code
}
```

### Q: 如何处理 Firebase 认证错误？

A: 参考 [Firestore API 规范](./openspec/api/firestore.md) 中的错误处理模式。

### Q: Bundle Size 超出预算怎么办？

A: 
1. 检查是否有未使用的导入
2. 使用懒加载路由
3. 优化图片资源（使用 WebP）

---

## 相关资源

- **[openspec 规范索引](./openspec/README.md)** - 完整技术文档
- **[项目 README](./README.md)** - 项目概述
- **[变更日志](./CHANGELOG.md)** - 版本历史
- **[改进记录](./IMPROVEMENTS.md)** - 近期改进

---

**最后更新**: 2026-05-01
