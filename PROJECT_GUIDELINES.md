# Veloform 项目规范

## 目的
本规范文档用于统一 Veloform 项目开发流程、代码风格、测试要求和文档维护策略，帮助团队保持代码一致性、提高协作效率、降低发布风险。

## 目录
- [本地开发](#本地开发)
- [运行命令](#运行命令)
- [代码规范](#代码规范)
- [分支与提交](#分支与提交)
- [PR 与审核](#pr-与审核)
- [测试要求](#测试要求)
- [文档维护](#文档维护)
- [环境配置](#环境配置)

---

## 本地开发

1. 克隆仓库后，安装依赖：
   ```bash
   npm install
   ```
2. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```
3. 启动开发服务：
   ```bash
   npm run dev
   ```

---

## 运行命令

- `npm run dev`：本地开发服务器
- `npm run build`：生产构建
- `npm run test`：执行单元测试
- `npm run lint`：执行 ESLint 检查
- `npm run watch`：开发模式构建并监听文件变化
- `npm run serve:ssr:app`：运行 SSR 服务

---

## 代码规范

### Angular 与 TypeScript
- 使用 Angular standalone 组件与模块最小化依赖。
- 组件默认使用 `OnPush` 变更检测。
- 组件内部 UI 状态优先使用 `signals`，不要为简单 UI 状态引入 RxJS。
- 服务层使用 `inject()` 或依赖注入，不使用全局变量。
- 避免使用 `any`，必要时使用明确类型或泛型。
- 导出函数和类应尽量补全类型签名。

### 文件与命名
- 文件名使用小写 `kebab-case`，组件文件名与类名对应。
- 组件选择器保持 `app-` 前缀，使用 `kebab-case`。
- 服务、组件、模型文件分别存放在 `src/app/services/`、`src/app/components/`、`src/app/` 根目录。
- 每个组件或服务一个文件，测试文件与被测文件同目录。

### 样式与布局
- 使用 Tailwind CSS 进行样式开发，优先使用实用类而非内联样式。
- 遵循移动优先设计，使用响应式断点实现自适应。
- 保持语义化 HTML，使用可访问性属性（如 `aria-label`、`role`）增强可访问性。

### 注释与文档
- 对公开函数、服务方法、组件输入输出使用 JSDoc 注释。
- 不要写过度注释；注释应补充代码意图，而非重复代码。
- `TODO` 和 `FIXME` 注释应包含责任人或日期，如 `// TODO(jack): 支持更多车型`。

### 代码质量
- 代码提交之前执行 `npm run lint`。
- 运行相关单元测试，确保没有失败。
- 变更应遵循最小可行原则，避免不必要的重构混入功能提交。

---

## 分支与提交

### 分支命名
- 功能分支：`feature/<描述>`
- 修复分支：`fix/<描述>`
- 文档分支：`docs/<描述>`
- 热修复分支：`hotfix/<描述>`

### 提交信息规范
使用简洁、规范的提交信息：
```
<type>(<scope>): <简短描述>

可选的详细说明，解释为什么需要此更改。
```

常见 `type`：
- `feat`: 新功能
- `fix`: bug 修复
- `docs`: 文档更新
- `style`: 格式、代码风格、空白等
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建、配置等杂项

示例：
```
feat(components): add confirm dialog service
```

---

## PR 与审核

- 所有更改优先走 Pull Request 流程。
- 每个 PR 至少一位 reviewer 审核通过后合并。
- PR 描述应包含变更摘要、测试方式和关联 issue 或任务。
- 更新依赖、配置或安全相关改动应特别说明潜在影响。

---

## 测试要求

- 新功能必须配套单元测试。
- 修复 bug 时尽量补充回归测试。
- 测试文件放在与被测文件同一目录中，命名为 `*.spec.ts`。
- 运行测试：
  ```bash
  npm run test
  ```

---

## 文档维护

- `README.md` / `README_CN.md`：项目概述、运行与开发说明。
- `openspec/SPEC.md`：核心产品需求、架构规范、接口约定。
- `PROJECT_GUIDELINES.md`：项目规范与协作流程。
- 实现改进和设计记录可写入 `IMPROVEMENTS.md`。
- 变更时同步更新对应文档，保持文档和代码一致。

---

## 环境配置

- 所有私密配置不应提交到仓库。
- 使用 `.env.example` 提供示例变量名。
- 本地开发人员须创建 `.env` 并填入对应 Firebase 配置。
- `.gitignore` 已忽略 `.env*` 文件。
