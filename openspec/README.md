# Veloform 规范文档索引

## 概述

本文档是 Veloform 项目规范体系的导航入口，提供所有技术规范和开发指南的快速访问。

**当前版本**: v3.1.0

---

## 📚 文档结构

### 🏗️ 架构规范 (Architecture)

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [架构概览](./architecture/overview.md) | 项目概述、技术栈、核心架构原则、目录结构 | 了解项目整体架构 |
| [数据流设计](./architecture/data-flow.md) | 状态管理、组件通信、副作用处理、持久化流程 | 理解数据如何在系统中流动 |
| [组件设计规范](./architecture/component-design.md) | 组件分类、命名规范、输入输出、变更检测、可访问性 | 开发新组件时参考 |

### 🔌 API 规范 (API)

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [Firestore API](./api/firestore.md) | Firebase 服务接口、安全规则、错误处理、性能优化 | 调用后端服务时参考 |
| [数据模型](./api/data-models.md) | 实体定义、Schema、验证规则、ER 图 | 理解数据结构时参考 |

### 💻 开发规范 (Development)

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [编码规范](./development/coding-standards.md) | TypeScript、Angular、样式、Git 工作流、性能优化 | 编写代码时遵循 |
| [测试规范](./development/testing.md) | 测试策略、框架使用、覆盖率要求、最佳实践 | 编写测试时参考 |

### 🚀 部署规范 (Deployment)

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| [环境配置](./deployment/environments.md) | 部署流程、环境变量、SSR 配置、监控、SEO | 部署应用时参考 |

---

## 🗺️ 快速导航

### 我是新加入的开发者，应该从哪里开始？

1. 阅读 [架构概览](./architecture/overview.md) 了解项目整体结构
2. 查看 [编码规范](./development/coding-standards.md) 了解代码风格要求
3. 运行 `npm run dev` 启动本地开发环境
4. 阅读 [PROJECT_GUIDELINES.md](../PROJECT_GUIDELINES.md) 了解协作流程

### 我要开发一个新功能

1. 查看 [组件设计规范](./architecture/component-design.md) 了解组件开发标准
2. 参考 [数据流设计](./architecture/data-flow.md) 理解状态管理模式
3. 如需调用后端，查阅 [Firestore API](./api/firestore.md)
4. 完成后按照 [测试规范](./development/testing.md) 编写测试

### 我要修复一个 Bug

1. 定位问题所在的模块（组件/服务/数据模型）
2. 查阅相关规范文档理解预期行为
3. 按照 [测试规范](./development/testing.md) 添加回归测试
4. 提交 PR 时遵循 [编码规范](./development/coding-standards.md) 中的 Git 工作流

### 我要部署到生产环境

1. 阅读 [环境配置](./deployment/environments.md) 了解部署流程
2. 确保所有测试通过且覆盖率达标
3. 检查 Bundle Size 是否在预算内
4. 按照部署检查清单逐项验证

---

## 📋 规范遵守检查清单

在提交代码前，请确认：

### 代码质量
- [ ] 遵循 [编码规范](./development/coding-standards.md)
- [ ] 通过 ESLint 检查 (`npm run lint`)
- [ ] 无 `any` 类型滥用
- [ ] 组件使用 `OnPush` 变更检测
- [ ] 使用 Signal-based 状态管理

### 测试
- [ ] 新功能包含单元测试
- [ ] Bug 修复包含回归测试
- [ ] 测试覆盖率满足阈值要求
- [ ] 所有测试通过 (`npm run test`)

### 文档
- [ ] 公共 API 有 JSDoc 注释
- [ ] 复杂逻辑有清晰的注释
- [ ] 更新了相关规范文档（如需要）

### Git
- [ ] 分支命名符合规范 (`feature/`, `fix/`, etc.)
- [ ] 提交信息遵循 Conventional Commits
- [ ] PR 描述清晰，包含变更摘要和测试说明

---

## 🔄 文档维护

### 更新频率

- **架构文档**: 重大重构时更新
- **API 文档**: 接口变更时立即更新
- **开发规范**: 每季度审查一次
- **部署文档**: 部署流程变化时更新

### 贡献指南

如发现文档错误或需要补充：

1. 在 GitHub 上创建 Issue 描述问题
2. 或创建 PR 直接修复文档
3. 遵循现有文档的格式和风格
4. 确保示例代码可以正常运行

### 版本历史

规范文档的版本与项目主版本号同步：

| 规范版本 | 项目版本 | 更新日期 | 主要变更 |
|---------|---------|---------|---------|
| v3.1.0 | 3.1.1 | 2026-05-01 | 初始模块化重构 |
| v3.0.0 | 3.0.0 | 2026-XX-XX | 单一 SPEC.md |

详细变更记录见 [CHANGELOG.md](../CHANGELOG.md)

---

## 📞 获取帮助

- **技术问题**: 查阅相关规范文档
- **流程问题**: 查看 [PROJECT_GUIDELINES.md](../PROJECT_GUIDELINES.md)
- **Bug 报告**: 在 GitHub 创建 Issue
- **讨论**: 在项目 Discussions 中提问

---

## 🔗 相关资源

- [项目 README](../README.md) - 项目概述和快速开始
- [中文 README](../README_CN.md) - 中文版项目说明
- [改进记录](../IMPROVEMENTS.md) - 近期改进总结
- [变更日志](../CHANGELOG.md) - 版本历史

---

**最后更新**: 2026-05-01
