# Firestore API 接口规范

## 概述

Veloform 使用 Firebase Firestore 作为后端数据库，通过 Angular Firebase SDK 进行数据操作。本文档定义所有数据库集合的 schema、安全规则和 API 契约。

---

## 认证服务

### Google OAuth 登录

**函数**: `loginWithGoogle()`

**位置**: `src/app/services/firebase.ts`

**返回值**: `Promise<void>`

**行为**：
- 触发 Google OAuth popup
- 成功后自动更新 Firebase Auth 状态
- 失败时抛出结构化错误

**错误处理**：

```typescript
try {
  await loginWithGoogle();
} catch (error) {
  // Error structure
  {
    code: string;        // e.g., 'auth/popup-closed-by-user'
    message: string;     // Human-readable message
    operation: 'login';
    path: '/auth/google';
    authenticated: boolean;
  }
}
```

---

## 配置管理 API

### 1. 保存配置

**函数**: `saveConfiguration(config: Configuration)`

**位置**: `src/app/services/firebase.ts`

**参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config` | `Configuration` | Yes | 配置对象 |

**Configuration Schema**：

```typescript
interface Configuration {
  id?: string;                    // Firestore Document ID (auto-generated)
  userId?: string;                // Owner's Firebase Auth UID (set server-side)
  bikeType: 'Road' | 'MTB' | 'Fold';
  name: string;                   // Max 200 chars
  components: ConfigComponent[];  // Max 50 items
  totalCost: number;              // USD, must be >= 0
  estimatedWeight: number;        // kg, must be > 0
  createdAt?: Timestamp;          // Server timestamp (set on create)
  updatedAt?: Timestamp;          // Server timestamp (set on every save)
}
```

**返回值**: `Promise<void>`

**行为**：
- 如果 `config.id` 存在：执行 merge update
- 如果 `config.id` 不存在：创建新文档，自动生成 UUID
- 自动设置 `userId`（从当前认证用户）
- 自动设置 `updatedAt` 为服务器时间戳
- 首次保存时设置 `createdAt`

**示例**：

```typescript
const config: Configuration = {
  bikeType: 'Road',
  name: 'S-Works Tarmac SL8',
  components: [
    {
      id: 'frame_road_sl8',
      category: 'Frame',
      name: 'S-Works Tarmac SL8 Frame',
      price: 3500,
      weight: 795
    }
  ],
  totalCost: 8500,
  estimatedWeight: 6.8
};

await saveConfiguration(config);
```

**错误场景**：

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| `permission-denied` | 未认证或不是所有者 | 提示用户重新登录 |
| `invalid-argument` | Schema 验证失败 | 显示具体字段错误 |
| `unavailable` | Firestore 不可用 | 重试机制（最多 3 次） |

---

### 2. 获取用户配置列表

**函数**: `getUserConfigurations()`

**位置**: `src/app/services/firebase.ts`

**参数**: 无（从当前认证用户推导）

**返回值**: `Promise<Configuration[]>`

**查询条件**：
- Collection: `configurations`
- Filter: `userId == currentUser.uid`
- Order: `updatedAt DESC`

**示例**：

```typescript
const configs = await getUserConfigurations();
// Returns: [{ id: '...', name: 'My Road Bike', ... }, ...]
```

**性能优化**：
- 限制返回数量（最多 100 条）
- 仅查询必要字段（projection）
- 客户端缓存结果（Signal-based）

**错误场景**：

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| `permission-denied` | 未认证 | 提示用户登录 |
| `unavailable` | Firestore 不可用 | 显示离线提示 |

---

### 3. 删除配置

**函数**: `deleteConfiguration(id: string)`

**位置**: `src/app/services/firebase.ts`

**参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | Yes | 配置文档 ID |

**返回值**: `Promise<void>`

**前置条件**：
- 用户已认证
- 用户是配置的所有者

**示例**：

```typescript
try {
  await deleteConfiguration('abc123');
  showNotification('Configuration deleted');
} catch (error) {
  showError('Failed to delete configuration');
}
```

**错误场景**：

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| `permission-denied` | 未认证或不是所有者 | 提示权限不足 |
| `not-found` | 配置不存在 | 静默忽略或刷新列表 |

---

## 组件字典 API

### 1. 获取组件列表

**函数**: `getComponentsFromDB()`

**位置**: `src/app/services/firebase.ts`

**参数**: 无

**返回值**: `Promise<DatabaseComponent[]>`

**DatabaseComponent Schema**：

```typescript
interface DatabaseComponent {
  id: string;           // Document ID (e.g., 'frame_road_sl8')
  category: string;     // e.g., 'Drivetrain', 'Wheelset', 'Frame'
  bikeType: string;     // 'Road' | 'MTB' | 'Fold'
  name: string;         // Display name
  price: number;        // USD
  weight: number;       // grams
  specs: string;        // Specification string
}
```

**行为**：
- 查询 `components` collection
- 如果 collection 为空，自动执行 `seedComponents()`
- 返回所有组件（客户端过滤 by bikeType）

**示例**：

```typescript
const allComponents = await getComponentsFromDB();
const roadComponents = allComponents.filter(c => c.bikeType === 'Road');
```

---

### 2. 组件种子数据

**函数**: `seedComponents()`

**位置**: `src/app/services/firebase.ts`

**触发条件**：`components` collection 为空时自动执行

**种子数据结构**：

```typescript
const SEED_COMPONENTS: DatabaseComponent[] = [
  // Road Bike Components (4 items)
  {
    id: 'frame_road_sl8',
    category: 'Frame',
    bikeType: 'Road',
    name: 'S-Works Tarmac SL8 Frame',
    price: 3500,
    weight: 795,
    specs: 'Carbon Fact 12r'
  },
  {
    id: 'drivetrain_road_duraace',
    category: 'Drivetrain',
    bikeType: 'Road',
    name: 'Shimano Dura-Ace Di2 R9200',
    price: 2800,
    weight: 1520,
    specs: '12-speed Electronic'
  },
  // ... more components
];
```

**注意**：种子数据仅在 demo 模式下写入，生产环境应通过管理后台维护。

---

## Firestore 安全规则

### 默认规则

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Components Collection

```javascript
match /components/{componentId} {
  // Get requires valid ID format
  allow get: if componentId.matches('^[a-zA-Z0-9_-]+$');

  // List is public (for component browser)
  allow list: if true;

  // Write is open for demo seeding (production should restrict)
  allow write: if true;
}
```

**访问模式**：
- **Read**: 公开读取（组件浏览器需要）
- **Write**: Demo 模式开放，生产环境应限制为管理员

---

### Configurations Collection

```javascript
match /configurations/{configurationId} {
  // Helper function for schema validation
  function isValidConfiguration() {
    return resource.data.keys().hasOnly([
      'userId', 'bikeType', 'name', 'components',
      'totalCost', 'estimatedWeight', 'createdAt', 'updatedAt'
    ])
    && resource.data.bikeType in ['Road', 'MTB', 'Fold']
    && resource.data.name is string
    && resource.data.name.size() <= 200
    && resource.data.totalCost is number
    && resource.data.totalCost >= 0
    && resource.data.estimatedWeight is number
    && resource.data.estimatedWeight > 0
    && resource.data.components is list
    && resource.data.components.size() <= 50;
  }

  // Get: authenticated + owner match
  allow get: if request.auth != null
             && resource.data.userId == request.auth.uid;

  // List: authenticated + owner match
  allow list: if request.auth != null
              && resource.data.userId == request.auth.uid;

  // Create: authenticated + valid schema
  allow create: if request.auth != null
                && request.resource.data.userId == request.auth.uid
                && isValidConfiguration();

  // Update: authenticated + owner + immutable fields
  allow update: if request.auth != null
                && resource.data.userId == request.auth.uid
                && request.resource.data.userId == resource.data.userId
                && request.resource.data.createdAt == resource.data.createdAt
                && request.resource.data.updatedAt == request.time;

  // Delete: authenticated + owner
  allow delete: if request.auth != null
                && resource.data.userId == request.auth.uid;
}
```

**关键约束**：
1. **所有者隔离**：用户只能访问自己的配置
2. **不可变字段**：`userId` 和 `createdAt` 创建后不可修改
3. **Schema 验证**：严格字段类型和范围检查
4. **时间戳强制**：`updatedAt` 必须为服务器时间

---

## 错误处理模式

### 结构化错误对象

```typescript
interface FirestoreErrorInfo {
  message: string;          // Original error message
  operation: 'create' | 'read' | 'update' | 'delete' | 'login';
  path: string;             // Firestore path
  authenticated: boolean;   // User auth status
  timestamp: number;        // Error occurrence time
}
```

### 错误处理示例

```typescript
async function handleFirestoreError(
  error: any,
  operation: string,
  path: string
): Promise<never> {
  const errorInfo: FirestoreErrorInfo = {
    message: error.message || 'Unknown error',
    operation,
    path,
    authenticated: !!auth.currentUser,
    timestamp: Date.now()
  };

  console.error('[Firestore Error]', errorInfo);

  // Re-throw with structured info
  throw errorInfo;
}
```

### 客户端错误处理

```typescript
try {
  await saveConfiguration(config);
} catch (error: any) {
  if (error.operation === 'create') {
    if (error.message.includes('permission-denied')) {
      showNotification('Please log in to save configurations', 'error');
      openLoginModal();
    } else if (error.message.includes('invalid-argument')) {
      showNotification('Invalid configuration data', 'error');
    } else {
      showNotification('Failed to save. Please try again.', 'error');
    }
  }
}
```

---

## 性能优化建议

### 1. 查询优化

```typescript
// Good - Use where clause
query(collection(firestore, 'configurations'),
      where('userId', '==', uid),
      orderBy('updatedAt', 'desc'),
      limit(100));

// Bad - Client-side filtering
getDocs(collection(firestore, 'configurations'))
  .then(docs => docs.filter(d => d.userId === uid));
```

### 2. 索引策略

确保以下复合索引已创建：
- `configurations`: `(userId ASC, updatedAt DESC)`
- `components`: `(bikeType ASC, category ASC)`

### 3. 缓存策略

```typescript
// Signal-based caching
private _cachedComponents = signal<DatabaseComponent[]>([]);
private _lastFetchTime = signal<number>(0);

async getComponentsFromDB(): Promise<DatabaseComponent[]> {
  const now = Date.now();
  const cacheAge = now - this._lastFetchTime();

  // Cache for 5 minutes
  if (cacheAge < 5 * 60 * 1000 && this._cachedComponents().length > 0) {
    return this._cachedComponents();
  }

  const components = await fetchFromFirestore();
  this._cachedComponents.set(components);
  this._lastFetchTime.set(now);
  return components;
}
```

---

## 相关文档

- [架构概览](../architecture/overview.md)
- [数据模型](./data-models.md)
- [开发规范](../development/coding-standards.md)
