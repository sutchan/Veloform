# Veloform 规范概览 (v3.3.1)

> **注意**: 本文档已重构为模块化结构。详细内容请访问 [openspec/README.md](./README.md)。

## 项目概述

Veloform 是一个本地化（EN/ZH-CN）、高性能的自行车配置器，支持 **公路车**、**山地车** 和 **折叠车** 三类车型的自定义构建模拟。具备实时 3D 程序化可视化、Firebase 后端持久化和静态部署。

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
| **部署** | Vercel / EdgeOne Pages | — |

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

## 目录结构

```
src/
├── app/
│   ├── core/                          # 核心功能模块
│   │   ├── constants/                 # 应用常量
│   │   ├── models/                    # 数据模型/类型
│   │   ├── services/                  # 核心服务
│   │   └── stores/                    # 状态管理 (ConfigStore)
│   │
│   ├── features/                      # 功能模块
│   │   ├── configurator/              # 配置器模块
│   │   │   ├── components/            # 预览、配置清单、组件选择器
│   │   │   └── services/              # ConfigService
│   │   └── navbar/                    # 导航栏模块
│   │
│   ├── shared/                        # 共享组件
│   │   └── components/                # 侧边栏、加载指示器、通知、对话框
│   │
│   └── app.ts                         # 根组件
│
├── public/                            # 静态资源 (EdgeOne 配置)
├── styles.css                         # 全局样式
└── main.ts                            # 入口文件
```

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
- 使用 `inject()` 进行依赖注入

### Angular
- Standalone + OnPush
- Signal-based 状态管理
- 组件必须使用 `input()` / `output()` 装饰器

### 测试
- 覆盖率目标：≥80%
- 新功能必须配套单元测试

完整开发规范见：
- [编码规范](./development/coding-standards.md)
- [测试规范](./development/testing.md)

---

## 部署

- **平台**: Vercel / EdgeOne Pages
- **构建命令**: `npm run build`
- **输出目录**: `dist/browser`
- **SPA 配置**: `_redirects` 和 `_headers` 文件用于边缘部署

完整部署指南见 [环境配置](./deployment/environments.md)

---

## UI 组件清单

| 组件 | 说明 | 状态 |
|------|------|------|
| `NavbarComponent` | 顶部导航栏，含语言切换、主题切换 | ✅ |
| `SidebarComponent` | 桌面端自行车类型选择器 | ✅ |
| `PreviewComponent` | 3D 自行车预览 + 统计信息 | ✅ |
| `BuildListComponent` | 配置清单 + 同步/部署按钮 | ✅ |
| `ComponentSelectorComponent` | 组件选择模态框 | ✅ |
| `NotificationDisplayComponent` | 通知提示组件 | ✅ |
| `ConfirmDialogComponent` | 确认对话框组件 | ✅ |
| `LoadingIndicatorComponent` | 加载指示器组件 | ✅ |

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
| v3.3.1 | 3.3.1 | 2026-05-19 | 动态项目 ID、测试文件整理 |
| v3.3.0 | 3.3.0 | 2026-05-11 | 完整架构重构，引入 Feature-Based 分层结构（Core/Features/Shared），修复 UI Bug |
| v3.2.0 | 3.2.0 | 2026-05-01 | 新增组件编辑模态框、路由系统、通知系统、确认对话框服务 |
| v3.1.0 | 3.1.0 | 2026-05-01 | 模块化重构，拆分为多个专业文档 |

---

**最后更新**: 2026-05-11
