# Veloform 架构概览 (v3.1.0)

## 项目概述

Veloform 是一个本地化（EN/ZH）、高性能的自行车配置器，专为骑行者设计，支持 **公路车**、**山地车** 和 **折叠车** 三类车型的自定义构建模拟。它具备实时 3D 程序化可视化、Firebase 后端持久化和服务器端渲染（SSR）以优化 SEO。

- **生产地址**: `https://veloform.app`
- **代码仓库**: `https://github.com/sutchan/Veloform`

---

## 技术栈

| 层级 | 技术 | 版本 |
| :--- | :--- | :--- |
| **框架** | Angular (Zoneless, Signal-based) | ^21.0.0 |
| **语言** | TypeScript | ~5.9.2 |
| **样式** | Tailwind CSS (Mobile-first) | ^4.1.12 |
| **后端/数据库** | Firebase (Firestore, Auth) | ^12.12.1 |
| **3D 渲染** | Three.js (Procedural WebGL) | ^0.184.0 |
| **SSR 运行时** | Express + Angular SSR | ^5.1.0 / ^21.0.0 |
| **动画** | Motion | ^12.23.24 |
| **AI 集成** | Google GenAI SDK | ^1.27.0 |
| **代码检查** | ESLint + angular-eslint | ^9.39.1 / 21.1.0 |
| **测试** | Vitest | ^4.0.0 |
| **部署** | Vercel (Angular framework preset) | — |
| **国际化** | Custom Signal-based I18n service | — |

---

## 核心架构原则

### 1. 单向数据流

使用 **Angular Signals** 实现单向数据流。根组件 (`app.ts`) 维护活跃配置状态，通过 `input()` / `output()` 装饰器分发给子组件。

```
app.ts (root state)
  ├── signals: activeType, components, isSaving, configId, showLibrary, myConfigs, isLoggedIn
  ├── computed: configName, totalCost, baseWeight, totalWeight
  ├── effects: auth state listener, library auto-refresh
  │
  ├── NavbarComponent
  │     inputs: —
  │     outputs: openLibrary
  │     signals: user, isDark, lang
  │
  ├── SidebarComponent
  │     inputs: activeType
  │     outputs: typeSelected
  │
  ├── PreviewComponent
  │     inputs: name, type, weight, cost
  │     internal: Three.js scene (renderer, camera, bikeGroup)
  │
  └── BuildListComponent
        inputs: components, isSaving
        outputs: sync, deploy
```

### 2. 变更检测策略

所有组件使用 `ChangeDetectionStrategy.OnPush` 以获得最佳性能。Angular 21 的 zoneless 架构消除了 Zone.js 开销，实现亚毫秒级 UI 更新。

### 3. 组件设计原则

- 使用 Angular standalone 组件，保持设计松耦合
- 组件默认使用 `OnPush` 变更检测
- UI 状态尽量采用 `signals`，非必要时不引入 RxJS 作为组件局部状态管理
- `app-` 前缀组件选择器，文件名和类名保持一致并使用 `kebab-case`
- 服务层应使用 dependency injection，不使用全局可变状态

---

## 目录结构

```
src/
├── app/
│   ├── components/                          # UI 组件
│   │   ├── build-list.ts                    # 构建列表面板 + 同步/部署操作
│   │   ├── build-list.spec.ts               # 构建列表测试
│   │   ├── component-selector.ts            # 组件选择器模态框
│   │   ├── component-selector.spec.ts       # 组件选择器测试
│   │   ├── confirm-dialog.ts                # 确认对话框组件
│   │   ├── loading-indicator.ts             # 加载指示器组件
│   │   ├── navbar.ts                        # 顶部导航栏
│   │   ├── notification-display.ts          # 通知显示组件
│   │   ├── notification-display.spec.ts     # 通知显示测试
│   │   ├── preview.ts                       # 3D Three.js 预览 + 统计页脚
│   │   └── sidebar.ts                       # 车型选择侧边栏
│   ├── services/                            # 服务层
│   │   ├── firebase.ts                      # Firebase 集成（CRUD、认证、错误处理）
│   │   ├── firebase.spec.ts                 # Firebase 服务测试
│   │   ├── i18n.ts                          # 国际化服务
│   │   ├── i18n.spec.ts                     # 国际化服务测试
│   │   └── notification.ts                  # 通知管理服务
│   ├── app.ts                               # 根组件（状态管理、布局编排）
│   ├── app.config.ts                        # 浏览器应用配置
│   ├── app.config.server.ts                 # 服务器应用配置（SSR）
│   ├── app.routes.ts                        # 客户端路由定义
│   ├── app.routes.server.ts                 # 服务器路由定义
│   ├── app.constants.ts                     # 静态默认组件数据
│   ├── types.ts                             # TypeScript 类型定义
│   ├── style.css                            # 组件作用域样式 + Tailwind 主题
│   └── app.spec.ts                          # 根组件测试
├── main.ts                                  # 浏览器入口
├── main.server.ts                           # SSR 入口
├── server.ts                                # Express SSR 服务器
├── styles.css                               # 全局样式
├── index.html                               # HTML 壳（SEO 元标签、JSON-LD）
├── routes.ts                                # 路由配置
└── globals.d.ts                             # 全局类型声明
```

---

## 关键设计决策

### 为什么选择 Zoneless Angular？

- **性能优势**：消除 Zone.js 补丁开销，减少内存占用
- **简化调试**：无需处理 change detection cycles
- **更好的 tree-shaking**：未使用的代码更容易被移除

### 为什么使用 Signal-based 状态管理？

- **细粒度响应式**：只有依赖的信号变化时才重新计算
- **类型安全**：编译时类型检查
- **组合性**：computed signals 可以轻松组合多个信号

### 为什么选择 Three.js 而非其他 3D 库？

- **轻量级**：仅需核心功能，bundle size 可控
- **灵活性**：程序化生成几何体，无需加载外部模型文件
- **成熟生态**：丰富的示例和社区支持

---

## 相关文档

- [数据流设计](./data-flow.md)
- [组件设计规范](./component-design.md)
- [API 接口规范](../api/firestore.md)
- [开发规范](../development/coding-standards.md)
