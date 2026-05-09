# Veloform 规范概览 (v3.3.0)

> **注意**: 本文档已重构为模块化结构。详细内容请访问 [openspec/README.md](./README.md)。

## 项目概述

Veloform 是一个本地化（EN/ZH）、高性能的自行车配置器，支持 **公路车**、**山地车** 和 **折叠车** 三类车型的自定义构建模拟。具备实时 3D 程序化可视化、Firebase 后端持久化和服务器端渲染（SSR）。

- **生产地址**: `https://veloform.app`
- **代码仓库**: `https://github.com/sutchan/Veloform`

---

## 技术栈摘要

| 层级 | 技术 | 版本 |
| :--- | :--- | :--- |
| **框架** | Angular (Zoneless, Signal-based) | ^21.0.0 |
| **语言** | TypeScript | ~5.9.2 |
| **样式** | Tailwind CSS (Mobile-first) | ^4.1.12 |
| **后端/数据库** | Firebase (Firestore, Auth) | ^12.12.1 |
| **3D 渲染** | Three.js (Procedural WebGL) | ^0.184.0 |
| **SSR 运行时** | Express + Angular SSR | ^5.1.0 / ^21.0.0 |
| **测试** | Vitest | ^4.0.0 |
| **部署** | Vercel | — |

完整技术栈说明见 [架构概览](./architecture/overview.md)

---

## 核心架构原则

1. **分层架构** - Core / Features / Shared 三层分离
2. **单向数据流** - 使用 Angular Signals 实现可预测的状态管理
3. **OnPush 变更检测** - 所有组件默认使用 OnPush 策略
4. **Standalone Components** - 扁平化组件架构
5. **Repository 模式** - 数据访问层与业务逻辑分离
6. **平台安全** - Three.js 和 DOM 操作需要 `isPlatformBrowser()` 检查

详细架构设计见：
- [架构概览](./architecture/overview.md)
- [数据流设计](./architecture/data-flow.md)
- [组件设计规范](./architecture/component-design.md)

---

## 数据模型

### 核心实体

- **ConfigComponent** - 自行车组件（车架、传动、轮组等）
- **Configuration** - 用户保存的自行车配置
- **DatabaseComponent** - Firestore 中的全局组件字典

完整数据模型定义见 [数据模型规范](./api/data-models.md)

---

## API 接口

### Firebase 服务

- `loginWithGoogle()` - Google OAuth 登录
- `saveConfiguration(config)` - 保存配置到 Firestore
- `getUserConfigurations()` - 获取用户配置列表
- `deleteConfiguration(id)` - 删除配置
- `getComponentsFromDB()` - 获取组件字典

完整 API 规范见 [Firestore API 规范](./api/firestore.md)

---

## 开发规范要点

### TypeScript
- 避免 `any`，使用明确类型
- 导出函数必须标注返回类型

### Angular
- Standalone + OnPush
- Signal-based 状态管理
- 使用 `inject()` 依赖注入

### 测试
- 覆盖率目标：≥80%
- 新功能必须配套单元测试

完整开发规范见：
- [编码规范](./development/coding-standards.md)
- [测试规范](./development/testing.md)

---

## 部署

- **平台**: Vercel (Angular framework preset)
- **构建命令**: `npm run build`
- **输出目录**: `dist/app/browser`
- **SSR**: 可选 Express 运行时

完整部署指南见 [环境配置](./deployment/environments.md)

---

## 文档导航

### 📚 完整规范体系

| 分类 | 文档 |
|------|------|
| **架构** | [概览](./architecture/overview.md) · [数据流](./architecture/data-flow.md) · [组件设计](./architecture/component-design.md) |
| **API** | [Firestore](./api/firestore.md) · [数据模型](./api/data-models.md) |
| **开发** | [编码规范](./development/coding-standards.md) · [测试](./development/testing.md) |
| **部署** | [环境配置](./deployment/environments.md) |

### 🔗 相关文档

- **[openspec/README.md](./README.md)** - 规范索引入口（推荐从这里开始）
- **[PROJECT_GUIDELINES.md](../PROJECT_GUIDELINES.md)** - 项目开发指南和协作流程
- **[README.md](../README.md)** - 项目概述
- **[CHANGELOG.md](../CHANGELOG.md)** - 版本历史

---

## 版本历史

| 规范版本 | 项目版本 | 更新日期 | 说明 |
|---------|---------|---------|------|
| v3.3.0 | 3.3.0 | 2026-05-08 | 完整架构重构，引入 Feature-Based 分层结构（Core/Features/Shared） |
| v3.2.0 | 3.2.0 | 2026-05-01 | 新增组件编辑模态框、路由系统、通知系统、确认对话框服务 |
| v3.1.0 | 3.1.0 | 2026-05-01 | 模块化重构，拆分为多个专业文档 |

---

**最后更新**: 2026-05-08
