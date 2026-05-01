# 组件设计规范

## 组件架构原则

Veloform 采用扁平化组件架构，所有组件均为 standalone components，避免模块嵌套带来的复杂性。

---

## 组件分类

### 1. 智能组件 (Smart Components)

负责状态管理和业务逻辑，通常位于组件树顶层。

**示例**：`app.ts` (根组件)

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, PreviewComponent, BuildListComponent],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // State management
  activeType = signal<'Road' | 'MTB' | 'Fold'>('Road');
  components = signal<ConfigComponent[]>(DEFAULT_ROAD_COMPONENTS);

  // Business logic
  handleTypeChange(type: 'Road' | 'MTB' | 'Fold') {
    this.activeType.set(type);
    this.loadComponentsForType(type);
  }
}
```

**职责**：
- 维护应用状态
- 协调子组件交互
- 调用服务层 API
- 处理副作用

### 2. 展示组件 (Presentational Components)

负责 UI 渲染和用户交互，通过 inputs/outputs 与父组件通信。

**示例**：`PreviewComponent`

```typescript
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {
  name = input.required<string>();
  type = input.required<'Road' | 'MTB' | 'Fold'>();
  weight = input.required<number>();
  cost = input.required<number>();

  // Pure UI logic only
}
```

**职责**：
- 接收数据并渲染 UI
- 发射用户交互事件
- 不包含业务逻辑
- 无副作用

---

## 组件命名规范

### 文件命名

- 使用 `kebab-case`：`build-list.ts`
- 测试文件与被测文件同目录：`build-list.spec.ts`
- 组件类名使用 `PascalCase`：`BuildListComponent`

### 选择器命名

- 统一使用 `app-` 前缀
- 使用 `kebab-case`：`app-build-list`

```typescript
@Component({
  selector: 'app-build-list',  // ✅ Good
  // selector: 'buildList',    // ❌ Bad - no prefix, camelCase
  // selector: 'app_build_list', // ❌ Bad - underscores
})
```

---

## 输入输出规范

### Inputs

使用 `input()` 和 `input.required()` 定义组件输入：

```typescript
export class ComponentSelectorComponent {
  // Required input
  components = input.required<ConfigComponent[]>();

  // Optional input with default
  isLoading = input<boolean>(false);

  // Input with transform
  count = input<number, string | number>(0, {
    transform: (value: string | number) => Number(value)
  });
}
```

**最佳实践**：
- 优先使用 `input.required()` 明确必需属性
- 为可选 input 提供合理的默认值
- 避免在模板中直接访问 `input()` signal，使用 `computed` 派生

### Outputs

使用 `output()` 定义组件事件：

```typescript
export class BuildListComponent {
  sync = output<void>();
  deploy = output<void>();

  onSave() {
    this.sync.emit();
  }
}
```

**最佳实践**：
- 事件名称使用动词（`save`、`delete`、`select`）
- 避免在 output 中传递复杂对象
- 使用 TypeScript 枚举或字面量类型限制事件 payload

---

## 变更检测策略

### OnPush 策略

所有组件默认使用 `OnPush`：

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**触发更新的条件**：
1. Input 引用发生变化
2. Output 事件发射
3. 手动调用 `ChangeDetectorRef.markForCheck()`
4. Async pipe 订阅的值变化（本项目不使用 RxJS）

**注意事项**：
- 不可变数据更新：`signal.update(list => [...list, newItem])`
- 避免直接修改 input signal 指向的对象

---

## 生命周期钩子使用指南

### 推荐使用的钩子

| 钩子 | 用途 | 示例 |
|------|------|------|
| `ngOnInit` | 初始化逻辑、订阅服务 | 加载初始数据 |
| `ngAfterViewInit` | DOM 操作、3D 渲染初始化 | Three.js scene setup |
| `ngOnDestroy` | 清理资源、取消订阅 | 移除 event listeners |
| `ngOnChanges` | 响应 input 变化（简单场景） | 重新计算派生数据 |

### 避免使用的钩子

- `ngDoCheck`：性能开销大，优先使用 `effect()`
- `ngAfterContentInit/Checked`：内容投影在本项目中不使用

### Effect 替代生命周期钩子

对于响应式逻辑，优先使用 `effect()`：

```typescript
// Instead of ngOnChanges
effect(() => {
  const type = this.activeType();
  this.updateBikeMesh(type);
});
```

---

## 平台安全性

### SSR 兼容

Three.js 和 DOM 操作需要平台检查：

```typescript
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export class PreviewComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private renderer: WebGLRenderer | null = null;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJS();
    }
  }

  private initThreeJS() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    // ... rest of initialization
  }

  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
```

---

## 可访问性 (A11y)

### 键盘导航

所有交互元素必须支持键盘操作：

```html
<button
  tabindex="0"
  (keydown.enter)="onSelect()"
  (keydown.space)="onSelect()"
  aria-label="Select Road Bike"
>
  Road
</button>
```

### ARIA 属性

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Garage</h2>
</div>
```

### 焦点管理

```typescript
// Modal focus trap
@ViewChild('modalContainer') modalContainer!: ElementRef;

ngAfterViewInit() {
  this.modalContainer.nativeElement.focus();
}
```

---

## 组件测试规范

### 测试文件结构

```typescript
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

  it('should emit sync event on save button click', () => {
    const syncSpy = vi.fn();
    component.sync.subscribe(syncSpy);

    const saveButton = fixture.nativeElement.querySelector('#save-btn');
    saveButton.click();

    expect(syncSpy).toHaveBeenCalled();
  });
});
```

### 测试覆盖率目标

- **语句覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 75%
- **函数覆盖率**: ≥ 85%
- **行覆盖率**: ≥ 80%

---

## 样式规范

### Tailwind CSS 使用

优先使用实用类，避免自定义 CSS：

```html
<!-- Good -->
<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Save
</button>

<!-- Bad - inline styles -->
<button style="padding: 8px 16px; background: blue; color: white;">
  Save
</button>
```

### 响应式设计

使用移动优先断点：

```html
<div class="flex flex-col md:flex-row gap-4">
  <!-- Mobile: vertical stack -->
  <!-- Desktop: horizontal row -->
</div>
```

### 暗色模式支持

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

---

## 组件清单

| 组件 | 类型 | 职责 | Inputs | Outputs |
|------|------|------|--------|---------|
| `NavbarComponent` | Smart | 导航、认证、主题切换 | — | `openLibrary` |
| `SidebarComponent` | Presentational | 车型选择 | `activeType` | `typeSelected` |
| `PreviewComponent` | Presentational | 3D 预览 + 统计 | `name`, `type`, `weight`, `cost` | — |
| `BuildListComponent` | Smart | 组件列表、保存/部署 | `components`, `isSaving` | `sync`, `deploy` |
| `ComponentSelectorComponent` | Presentational | 组件选择模态框 | `components`, `selectedIds` | `select`, `close` |
| `ConfirmDialogComponent` | Presentational | 确认对话框 | `title`, `message` | `confirm`, `cancel` |
| `NotificationDisplayComponent` | Smart | 通知显示 | — | — |
| `LoadingIndicatorComponent` | Presentational | 加载指示器 | `isLoading` | — |

---

## 相关文档

- [架构概览](./overview.md)
- [数据流设计](./data-flow.md)
- [开发规范](../development/coding-standards.md)
