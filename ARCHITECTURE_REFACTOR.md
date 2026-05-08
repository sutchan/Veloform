# Veloform 项目架构重构文档 (v3.3.0)

## 📁 目录结构

项目已重构为更清晰的分层架构，采用 Feature-Based 结构。

```
src/
├── app/
│   ├── core/                      # 核心功能模块（共享）
│   │   ├── constants/             # 常量定义
│   │   │   └── app.constants.ts   # 应用常量
│   │   ├── models/                # 数据模型/类型
│   │   │   └── types.ts           # 类型定义
│   │   ├── services/              # 核心服务
│   │   │   ├── firebase.service.ts
│   │   │   ├── config.repository.ts
│   │   │   ├── component.repository.ts
│   │   │   ├── notification.service.ts
│   │   │   └── i18n.service.ts
│   │   ├── stores/                # 状态管理
│   │   │   └── config.store.ts
│   │   └── index.ts               # Barrel 导出
│   │
│   ├── features/                  # 功能模块
│   │   ├── configurator/          # 配置器模块
│   │   │   ├── components/
│   │   │   │   ├── preview.component.ts
│   │   │   │   ├── build-list.component.ts
│   │   │   │   └── component-selector.component.ts
│   │   │   └── services/
│   │   │       └── config.service.ts
│   │   │
│   │   ├── navbar/                # 导航栏模块
│   │   │   └── components/
│   │   │       └── navbar.component.ts
│   │   │
│   │   └── library/               # 方案库模块（预留）
│   │
│   ├── shared/                    # 共享组件
│   │   └── components/
│   │       ├── sidebar.component.ts
│   │       ├── loading-indicator.component.ts
│   │       ├── notification-display.component.ts
│   │       └── confirm-dialog.component.ts
│   │
│   ├── app.ts                     # 根组件
│   ├── app.config.ts              # 应用配置
│   └── app.routes.ts              # 路由配置
│
├── styles.css                     # 全局样式
└── main.ts                        # 入口文件
```

## 🎯 架构原则

### 1. Core Layer (核心层)
- **Services**: Firebase、通知、i18n 等核心服务
- **Models**: 全局类型定义和接口
- **Constants**: 应用级常量
- **Stores**: 全局状态管理（使用 Angular Signals）

### 2. Features Layer (功能层)
- **Configurator**: 自行车配置器核心功能
- **Navbar**: 导航栏功能
- **Library**: 方案库功能（预留扩展）

### 3. Shared Layer (共享层)
- 可复用的 UI 组件
- 通用 Pipes
- 工具函数

## 🔄 导入方式

### 推荐的新导入方式
```typescript
// 类型
import { ConfigComponent, Configuration } from './core/models/types';

// 服务
import { firebaseService } from './core/services/firebase.service';
import { configStore } from './core/stores/config.store';
import { i18nService, t } from './core/services/i18n.service';

// 组件
import { NavbarComponent } from './features/navbar/components/navbar.component';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator.component';
```

### 向后兼容
旧路径的导入仍然有效（通过别名重定向），但建议尽快迁移到新路径：

| 旧路径 | 新路径 |
|--------|--------|
| `./types` | `./core/models/types` |
| `./app.constants` | `./core/constants/app.constants` |
| `./services/firebase` | `./core/services/firebase.service` |
| `./services/notification` | `./core/services/notification.service` |
| `./services/i18n` | `./core/services/i18n.service` |
| `./services/config.store` | `./core/stores/config.store` |
| `./services/config.service` | `./features/configurator/services/config.service` |

## 🚀 主要改进

### 1. 服务拆分
- **FirebaseService**: Firebase 初始化和认证
- **ConfigRepository**: 配置数据访问层
- **ComponentRepository**: 组件数据访问层
- **NotificationService**: 通知管理
- **I18nService**: 国际化服务

### 2. 状态管理
使用 Angular Signals 实现响应式状态管理：
- `ConfigStore`: 集中管理配置状态
- Computed 属性自动计算派生值
- 单一数据流向

### 3. 组件组织
按功能模块组织组件：
- 配置器模块：`preview`, `build-list`, `component-selector`
- 导航栏模块：`navbar`
- 共享组件：`sidebar`, `loading-indicator`, `notification-display`, `confirm-dialog`

### 4. TypeScript 类型
增强的类型定义：
- `ConfigComponent`: 组件接口
- `Configuration`: 配置接口
- `BikeType`: 自行车类型
- `ComponentCategory`: 组件类别
- `ConfigState`: 状态接口
- `FirebaseConfig`: Firebase 配置接口

## 📦 Barrel 导出

使用 `index.ts` 文件创建 barrel 导出，简化导入：

```typescript
// 导出 core 模块所有内容
export * from './core';

// 或按需导入
import { ConfigComponent, Configuration } from './core/models';
import { configStore } from './core/stores';
```

## 🔧 开发指南

### 添加新组件
1. 根据组件类型放入相应目录
2. 创建 `index.ts` 导出
3. 在父模块的 `imports` 中添加

### 添加新服务
1. 放入 `core/services` 或相关功能模块的 `services`
2. 使用单例模式（导出实例）
3. 添加依赖注入配置

### 修改状态
通过 `ConfigStore` 的方法修改状态：
```typescript
configStore.setActiveType('MTB');
configStore.setComponents(newComponents);
```

## 📝 版本历史

- **v3.3.0**: 完整架构重构，引入 feature-based 结构
- **v3.2.0**: 添加组件选择器、路由系统、测试覆盖
- **v3.1.0**: 国际化支持、错误处理增强

## ✅ 验证

构建和测试命令：
```bash
npm run build     # 构建生产版本
npm run test      # 运行测试
npm run lint     # 代码检查
```

---

最后更新：2026-05-08
