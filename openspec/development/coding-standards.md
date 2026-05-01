# 开发规范

## 概述

本文档定义 Veloform 项目的代码风格、编程实践和协作流程。所有贡献者必须遵循这些规范以确保代码质量和一致性。

---

## TypeScript 编码规范

### 1. 类型安全

**强制使用明确类型，避免 `any`**：

```typescript
// ✅ Good
function calculateWeight(components: ConfigComponent[]): number {
  return components.reduce((sum, c) => sum + c.weight, 0);
}

// ❌ Bad
function calculateWeight(components: any): any {
  return components.reduce((sum, c) => sum + c.weight, 0);
}
```

**使用泛型增强类型安全**：

```typescript
// ✅ Good - Generic service
class DataService<T extends { id: string }> {
  private items = signal<T[]>([]);

  addItem(item: T): void {
    this.items.update(list => [...list, item]);
  }
}

// Usage
const componentService = new DataService<ConfigComponent>();
```

**联合类型优于字符串字面量**：

```typescript
// ✅ Good
type BikeType = 'Road' | 'MTB' | 'Fold';
function setBikeType(type: BikeType) { ... }

// ❌ Bad
function setBikeType(type: string) { ... }
```

### 2. 函数签名

**完整标注输入输出类型**：

```typescript
// ✅ Good
async function saveConfiguration(
  config: Configuration
): Promise<void> {
  // ...
}

// ❌ Bad - Missing return type
async function saveConfiguration(config: Configuration) {
  // ...
}
```

**可选参数使用 `?` 而非 `undefined`**：

```typescript
// ✅ Good
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}` : `Hello, ${name}`;
}

// ❌ Bad
function greet(name: string, greeting: string | undefined): string {
  // ...
}
```

### 3. 接口与类型别名

**使用 `interface` 定义对象结构**：

```typescript
// ✅ Good
interface ConfigComponent {
  id: string;
  category: string;
  name: string;
  price: number;
  weight: number;
}
```

**使用 `type` 定义联合类型或工具类型**：

```typescript
// ✅ Good
type BikeType = 'Road' | 'MTB' | 'Fold';
type ComponentId = string & { readonly __brand: unique symbol };
```

---

## Angular 最佳实践

### 1. 组件设计

**Standalone Components**：

```typescript
@Component({
  selector: 'app-preview',
  standalone: true,  // Always use standalone
  imports: [CommonModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent { }
```

**OnPush 变更检测**：

```typescript
// ✅ All components should use OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Signal-based 状态管理**：

```typescript
// ✅ Good - Signal state
export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}

// ❌ Bad - RxJS for simple UI state
export class MyComponent {
  count$ = new BehaviorSubject<number>(0);
}
```

### 2. 依赖注入

**使用 `inject()` 函数**：

```typescript
// ✅ Modern approach
export class MyComponent {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
}

// ❌ Old constructor approach
export class MyComponent {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}
}
```

**服务单例保证**：

```typescript
@Injectable({
  providedIn: 'root'  // Ensure singleton
})
export class FirebaseService { }
```

### 3. 模板最佳实践

**避免模板中的复杂表达式**：

```html
<!-- ✅ Good - Use computed signal -->
<div>Total: {{ totalCost() | currency }}</div>

<!-- ❌ Bad - Complex calculation in template -->
<div>Total: {{ components().reduce((sum, c) => sum + c.price, 0) | currency }}</div>
```

**使用 `@for` 替代 `*ngFor`**：

```html
<!-- ✅ Angular 17+ syntax -->
@for (component of components(); track component.id) {
  <div>{{ component.name }}</div>
}

<!-- ❌ Old syntax -->
<div *ngFor="let component of components()">
  {{ component.name }}
</div>
```

**使用 `@if` 替代 `*ngIf`**：

```html
<!-- ✅ Angular 17+ syntax -->
@if (isLoading()) {
  <app-loading />
} @else {
  <app-content />
}

<!-- ❌ Old syntax -->
<app-loading *ngIf="isLoading()"></app-loading>
<app-content *ngIf="!isLoading()"></app-content>
```

---

## 样式规范

### Tailwind CSS 使用

**移动优先响应式**：

```html
<!-- Mobile: column, Desktop: row -->
<div class="flex flex-col md:flex-row gap-4">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>
```

**暗色模式支持**：

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

**避免自定义 CSS**：

```css
/* ❌ Bad - Unnecessary custom CSS */
.my-button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
}
```

```html
<!-- ✅ Good - Tailwind utilities -->
<button class="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

**提取重复模式为组件**：

```typescript
// Instead of repeating classes, create a component
@Component({
  selector: 'app-primary-button',
  template: `
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      <ng-content></ng-content>
    </button>
  `
})
export class PrimaryButtonComponent {}
```

---

## 测试规范

### 1. 测试文件组织

**测试文件位置**：与被测文件同目录

```
src/app/
├── services/
│   ├── firebase.ts
│   └── firebase.spec.ts
├── components/
│   ├── build-list.ts
│   └── build-list.spec.ts
```

**测试文件命名**：`*.spec.ts`

### 2. 测试结构

**标准测试模板**：

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildListComponent } from './build-list';

describe('BuildListComponent', () => {
  let component: BuildListComponent;
  let fixture: ComponentFixture<BuildListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 3. 测试覆盖率目标

| 指标 | 目标 |
|------|------|
| 语句覆盖率 | ≥ 80% |
| 分支覆盖率 | ≥ 75% |
| 函数覆盖率 | ≥ 85% |
| 行覆盖率 | ≥ 80% |

**运行测试**：

```bash
npm run test
```

### 4. Mock 策略

**Mock 服务**：

```typescript
class MockFirebaseService {
  authState = signal<User | null>(null);

  loginWithGoogle(): Promise<void> {
    return Promise.resolve();
  }

  saveConfiguration(config: Configuration): Promise<void> {
    return Promise.resolve();
  }
}

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [
      { provide: FirebaseService, useClass: MockFirebaseService }
    ]
  });
});
```

**Mock Signals**：

```typescript
it('should display loading state', () => {
  component.isSaving.set(true);
  fixture.detectChanges();

  const spinner = fixture.nativeElement.querySelector('.spinner');
  expect(spinner).toBeTruthy();
});
```

---

## 错误处理规范

### 1. 统一错误格式

```typescript
interface AppError {
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
}
```

### 2. Try-Catch 模式

```typescript
async function saveConfig(config: Configuration): Promise<void> {
  try {
    await firebaseService.saveConfiguration(config);
  } catch (error) {
    const appError: AppError = {
      code: 'SAVE_CONFIG_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error',
      context: { configId: config.id },
      timestamp: Date.now()
    };

    console.error('[Save Config Error]', appError);
    notificationService.show('Failed to save configuration', 'error');
    throw appError;
  }
}
```

### 3. 全局错误处理

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideErrorHandler({
      errorHandler: class CustomErrorHandler implements ErrorHandler {
        handleError(error: any): void {
          console.error('[Global Error]', error);
          // Send to error tracking service (e.g., Sentry)
        }
      }
    })
  ]
};
```

---

## 日志规范

### 1. 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| `ERROR` | 需要立即处理的错误 | API 调用失败、认证错误 |
| `WARN` | 潜在问题但不影响功能 | 废弃 API 使用、性能警告 |
| `INFO` | 重要业务事件 | 用户登录、配置保存 |
| `DEBUG` | 调试信息（仅开发环境） | 状态变更、API 请求详情 |

### 2. 日志格式

```typescript
// ✅ Good - Structured logging
console.log('[Auth] User logged in', {
  userId: user.uid,
  email: user.email,
  timestamp: new Date().toISOString()
});

// ❌ Bad - Unstructured
console.log('User logged in');
```

### 3. 生产环境日志

**移除 `console.log`**：

```typescript
// Use a logger service that can be disabled in production
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private isProduction = inject(ENVIRONMENT).production;

  log(message: string, data?: any): void {
    if (!this.isProduction) {
      console.log(message, data);
    }
  }

  error(message: string, error?: any): void {
    console.error(message, error);
    // Always log errors, even in production
  }
}
```

---

## 可访问性 (A11y) 规范

### WCAG 2.1 AA 合规要求

**键盘导航**：

```html
<!-- All interactive elements must be keyboard accessible -->
<button tabindex="0" (keydown.enter)="onSelect()" (keydown.space)="onSelect()">
  Select
</button>
```

**ARIA 标签**：

```html
<!-- Icon buttons need labels -->
<button aria-label="Close dialog" (click)="close()">
  <span class="material-icons">close</span>
</button>
```

**焦点管理**：

```typescript
// Modal should trap focus
@ViewChild('modal') modal!: ElementRef;

ngAfterViewInit() {
  this.modal.nativeElement.focus();
}
```

**颜色对比度**：

确保文本与背景对比度至少 4.5:1（AA 级）。

---

## 国际化规范

### 1. 翻译键命名

**命名空间.描述**：

```typescript
const translations = {
  'nav.home': 'Home',
  'nav.library': 'Library',
  'sidebar.road': 'Road Bike',
  'sidebar.mtb': 'Mountain Bike',
  'preview.weight': 'Weight',
  'preview.cost': 'Cost'
};
```

### 2. 使用翻译管道

```html
<!-- In templates -->
<h1>{{ 'nav.home' | translate }}</h1>

<!-- In components -->
export class MyComponent {
  private i18n = inject(I18nService);

  getTitle(): string {
    return this.i18n.translate('nav.home');
  }
}
```

### 3. 语言切换

```typescript
export class I18nService {
  currentLang = signal<'en' | 'zh-CN'>('en');

  toggleLang(): void {
    this.currentLang.update(lang => lang === 'en' ? 'zh-CN' : 'en');
  }
}
```

---

## Git 工作流

### 分支命名

```
feature/<description>   - New features
fix/<description>       - Bug fixes
docs/<description>      - Documentation updates
hotfix/<description>    - Critical fixes
```

**示例**：
- `feature/add-mtb-suspension`
- `fix/firebase-auth-error`
- `docs/update-api-spec`

### 提交信息规范

**Conventional Commits**：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**：
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Test changes
- `chore`: Build/config changes

**示例**：

```
feat(components): add suspension selector for MTB

- Add SuspensionCategory enum
- Update component-selector modal
- Filter components by bikeType

Closes #123
```

### PR 流程

1. 从 `main` 创建功能分支
2. 开发并提交更改
3. 推送分支到远程
4. 创建 Pull Request
5. 至少一位 reviewer 审核通过
6. 合并到 `main`
7. 删除功能分支

---

## 性能优化指南

### 1. Bundle Size 预算

| 类型 | 警告 | 错误 |
|------|------|------|
| Initial bundle | 1.5 MB | 2 MB |
| Component style | 4 kB | 8 kB |

**检查 bundle size**：

```bash
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### 2. 懒加载

**路由懒加载**：

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'library',
    loadComponent: () => import('./components/library').then(m => m.LibraryComponent)
  }
];
```

### 3. 图片优化

**使用 WebP 格式**：

```html
<picture>
  <source srcset="bike.webp" type="image/webp">
  <img src="bike.jpg" alt="Bike">
</picture>
```

**懒加载图片**：

```html
<img src="bike.jpg" loading="lazy" alt="Bike">
```

---

## 相关文档

- [架构概览](../architecture/overview.md)
- [组件设计规范](../architecture/component-design.md)
- [测试规范](./testing.md)
