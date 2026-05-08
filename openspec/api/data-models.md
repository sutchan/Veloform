# 数据模型规范

## 概述

本文档定义 Veloform 项目中所有核心数据实体的结构、约束和关系。

---

## 核心实体

### 1. ConfigComponent

表示自行车配置中的单个组件。

**Schema**：

| 属性 | 类型 | 必填 | 约束 | 说明 |
|------|------|------|------|------|
| `id` | `string` | Yes | Unique, kebab-case | 唯一标识符（如 `'frame_road_sl8'`） |
| `category` | `string` | Yes | Enum | 组件类别 |
| `name` | `string` | Yes | Max 200 chars | 显示名称 |
| `price` | `number` | Yes | >= 0 | 价格（USD） |
| `weight` | `number` | Yes | > 0 | 重量（grams） |
| `bikeType` | `BikeType` | No | `'Road' \| 'MTB' \| 'Fold'` | 关联车型 |
| `specs` | `string` | No | Max 500 chars | 规格描述 |

**Category 枚举值**：
- `Frame` - 车架
- `Drivetrain` - 传动系统
- `Wheelset` - 轮组
- `Suspension` - 悬挂（仅 MTB）
- `Cockpit` - 操控组件（车把、把立等）
- `Tires` - 轮胎

**示例**：

```typescript
const component: ConfigComponent = {
  id: 'drivetrain_road_duraace',
  category: 'Drivetrain',
  name: 'Shimano Dura-Ace Di2 R9200',
  price: 2800,
  weight: 1520,
  bikeType: 'Road',
  specs: '12-speed electronic, 2x12 configuration'
};
```

**验证规则**：

```typescript
function validateComponent(comp: ConfigComponent): boolean {
  return (
    typeof comp.id === 'string' &&
    comp.id.length > 0 &&
    /^[a-z0-9_-]+$/.test(comp.id) &&
    typeof comp.category === 'string' &&
    VALID_CATEGORIES.includes(comp.category) &&
    typeof comp.name === 'string' &&
    comp.name.length <= 200 &&
    typeof comp.price === 'number' &&
    comp.price >= 0 &&
    typeof comp.weight === 'number' &&
    comp.weight > 0
  );
}
```

---

### 2. Configuration

表示用户保存的自行车构建配置。

**Schema**：

| 属性 | 类型 | 必填 | 约束 | 说明 |
|------|------|------|------|------|
| `id` | `string` | No | UUID v4 | Firestore 文档 ID |
| `userId` | `string` | Yes* | Firebase UID | 所有者 UID（服务器端设置） |
| `bikeType` | `string` | Yes | `'Road' \| 'MTB' \| 'Fold'` | 车型类别 |
| `name` | `string` | Yes | Max 200 chars | 构建名称 |
| `components` | `ConfigComponent[]` | Yes | Max 50 items | 选中组件列表 |
| `totalCost` | `number` | Yes | >= 0 | 总成本（USD） |
| `estimatedWeight` | `number` | Yes | > 0 | 估算重量（kg） |
| `createdAt` | `Timestamp` | No | Server timestamp | 创建时间 |
| `updatedAt` | `Timestamp` | No | Server timestamp | 更新时间 |

*\* 创建时由服务器自动设置*

**示例**：

```typescript
const configuration: Configuration = {
  id: 'cfg_abc123',
  userId: 'user_xyz789',
  bikeType: 'Road',
  name: 'S-Works Tarmac SL8 Build',
  components: [
    {
      id: 'frame_road_sl8',
      category: 'Frame',
      name: 'S-Works Tarmac SL8 Frame',
      price: 3500,
      weight: 795
    },
    {
      id: 'drivetrain_road_duraace',
      category: 'Drivetrain',
      name: 'Shimano Dura-Ace Di2 R9200',
      price: 2800,
      weight: 1520
    }
  ],
  totalCost: 8500,
  estimatedWeight: 6.8,
  createdAt: Timestamp.fromDate(new Date('2026-05-01')),
  updatedAt: Timestamp.fromDate(new Date('2026-05-01'))
};
```

**计算逻辑**：

```typescript
// Total cost calculation
totalCost = components.reduce((sum, c) => sum + c.price, 0);

// Estimated weight calculation (includes base frame weight)
const baseWeights: Record<string, number> = {
  Road: 0.9,   // 900g base frame
  MTB: 1.8,    // 1800g base frame
  Fold: 2.0    // 2000g base frame
};

const componentWeightKg = components.reduce(
  (sum, c) => sum + c.weight / 1000,
  0
);

estimatedWeight = baseWeights[bikeType] + componentWeightKg;
```

**不变量**：
1. `userId` 创建后不可修改
2. `createdAt` 创建后不可修改
3. `updatedAt` 每次更新时必须刷新为服务器时间
4. `components` 数组长度不超过 50
5. `totalCost` 必须等于所有组件价格之和
6. `estimatedWeight` 必须包含基础车架重量

---

### 3. DatabaseComponent

存储在 Firestore `components` collection 中的全局组件字典。

**Schema**：

| 属性 | 类型 | 必填 | 约束 | 说明 |
|------|------|------|------|------|
| `id` | `string` | Yes | Document ID | 文档 ID |
| `category` | `string` | Yes | Enum | 组件类别 |
| `bikeType` | `string` | Yes | `'Road' \| 'MTB' \| 'Fold'` | 关联车型 |
| `name` | `string` | Yes | Max 200 chars | 显示名称 |
| `price` | `number` | Yes | >= 0 | 价格（USD） |
| `weight` | `number` | Yes | > 0 | 重量（grams） |
| `specs` | `string` | Yes | Max 500 chars | 规格字符串 |

**与 ConfigComponent 的区别**：
- `DatabaseComponent` 包含 `specs` 字段
- `DatabaseComponent` 始终有 `bikeType`
- `ConfigComponent` 是用户配置中的快照，可能来自 DB 或自定义

**示例**：

```typescript
const dbComponent: DatabaseComponent = {
  id: 'frame_road_sl8',
  category: 'Frame',
  bikeType: 'Road',
  name: 'S-Works Tarmac SL8 Frame',
  price: 3500,
  weight: 795,
  specs: 'Carbon Fact 12r, OSBB, 12x142mm Thru-Axle'
};
```

---

## 默认数据集

> ⚠️ 以下为 `app.constants.ts` 中定义的静态默认数据，与 Firestore `components` 集合中的种子数据可能存在差异。实际组件以 `getComponentsFromDB()` 返回的 Firestore 数据为准。

### Road Bike 默认组件

| ID | Category | Name | Price | Weight |
|----|----------|------|-------|--------|
| `1` | Drivetrain | Shimano Dura-Ace Di2 R9200 | $4200 | 2430g |
| `2` | Wheelset | Roval Rapide CLX II | $2800 | 1520g |
| `3` | Cockpit | Roval Rapide Cockpit | $600 | 310g |
| `4` | Tires | Turbo Cotton 28mm | $180 | 480g |

**Base Frame Weight**: 900g

---

### MTB 默认组件

| ID | Category | Name | Price | Weight |
|----|----------|------|-------|--------|
| `5` | Drivetrain | SRAM XX1 Eagle AXS | $2500 | 1515g |
| `6` | Suspension | Fox 34 Float Factory | $1050 | 1738g |
| `7` | Wheelset | Reserve 30\|SL | $1800 | 1650g |
| `8` | Tires | Maxxis Rekon 2.4 | $160 | 1600g |

**Base Frame Weight**: 1800g

---

### Fold 默认组件

| ID | Category | Name | Price | Weight |
|----|----------|------|-------|--------|
| `9` | Drivetrain | Brompton 6-Speed | $400 | 1200g |
| `10` | Frame | Titanium Main Frame | $2100 | 1800g |
| `11` | Wheelset | Brompton Superlight | $800 | 1100g |

**Base Frame Weight**: 2000g

---

## 类型定义

### TypeScript Interfaces

```typescript
// src/app/types.ts

export type BikeType = 'Road' | 'MTB' | 'Fold';

export interface ConfigComponent {
  id: string;
  category: string;        // 'Frame' | 'Drivetrain' | 'Wheelset' | 'Suspension' | 'Cockpit' | 'Tires'
  name: string;
  price: number;           // USD
  weight: number;          // grams
  bikeType?: BikeType;     // 仅在 DB 组件中使用
}

export interface DatabaseComponent extends ConfigComponent {
  bikeType: BikeType;     // DB 中必填
  specs: string;          // 规格描述字符串
}

export interface Configuration {
  id?: string;
  userId?: string;
  bikeType: BikeType;
  name: string;
  components: ConfigComponent[];
  totalCost: number;
  estimatedWeight: number; // kg（含基础车架重量）
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

---

## ER 图

> ⚠️ Firestore 为文档数据库（非关系型），以下 ER 图仅为概念性参考，展示数据实体之间的关系。Firestore 中无真正的外键约束。

```mermaid
erDiagram
    CONFIGURATIONS ||--o{ COMPONENTS_IN_CONFIG : contains
    USERS ||--o{ CONFIGURATIONS : owns
    DATABASE_COMPONENTS ||--o{ COMPONENTS_IN_CONFIG : "referenced by"

    USERS {
        string uid PK "Firebase Auth UID"
        string email "来自 Firebase Auth"
        string displayName "可选"
        string photoURL "可选"
    }

    CONFIGURATIONS {
        string id PK "Firestore Document ID"
        string userId FK "Firebase Auth UID"
        string bikeType "Road | MTB | Fold"
        string name
        number totalCost
        number estimatedWeight
        timestamp createdAt
        timestamp updatedAt
    }

    DATABASE_COMPONENTS {
        string id PK "Firestore Document ID (如 frame_road_sl8)"
        string category "Frame | Drivetrain | Wheelset | ..."
        string bikeType "Road | MTB | Fold"
        string name
        number price
        number weight
        string specs
    }

    COMPONENTS_IN_CONFIG {
        string configId FK "指向 CONFIGURATIONS"
        string componentId "组件 ID"
        string componentSnapshot "ConfigComponent 快照数据"
    }
```

---

## 数据验证规则

### 客户端验证

```typescript
export function validateConfiguration(config: Partial<Configuration>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Bike type validation
  if (!config.bikeType || !['Road', 'MTB', 'Fold'].includes(config.bikeType)) {
    errors.push('Invalid bike type');
  }

  // Name validation
  if (!config.name || config.name.length === 0) {
    errors.push('Name is required');
  } else if (config.name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }

  // Components validation
  if (!config.components || config.components.length === 0) {
    errors.push('At least one component is required');
  } else if (config.components.length > 50) {
    errors.push('Maximum 50 components allowed');
  }

  // Cost validation
  if (typeof config.totalCost !== 'number' || config.totalCost < 0) {
    errors.push('Total cost must be a non-negative number');
  }

  // Weight validation
  if (typeof config.estimatedWeight !== 'number' || config.estimatedWeight <= 0) {
    errors.push('Estimated weight must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 服务器端验证（Firestore Rules）

见 [Firestore API 规范](./firestore.md) 中的安全规则部分。

---

## 数据迁移策略

### Schema 版本控制

在 Configuration 中添加可选的 `schemaVersion` 字段：

```typescript
interface Configuration {
  // ... existing fields
  schemaVersion?: number; // Default: 1
}
```

### 迁移函数

```typescript
function migrateConfiguration(
  config: Configuration,
  fromVersion: number,
  toVersion: number
): Configuration {
  let migrated = { ...config };

  if (fromVersion === 1 && toVersion >= 2) {
    // Example: Add new field with default value
    migrated = {
      ...migrated,
      schemaVersion: 2,
      notes: migrated.notes || ''
    };
  }

  return migrated;
}
```

---

## 相关文档

- [Firestore API 规范](./firestore.md)
- [架构概览](../architecture/overview.md)
- [开发规范](../development/coding-standards.md)
