# 测试规范

## 概述

本文档定义 Veloform 项目的测试策略、测试框架使用方法和质量标准。

---

## 测试金字塔

```
        /\
       /  \
      / E2E \         ~10% - Critical user journeys
     /______\
    /        \
   /Integration\      ~20% - Service integration, component interaction
  /______________\
 /                \
/    Unit Tests    \   ~70% - Components, services, utilities
/____________________\
```

**目标分布**：
- **单元测试**: 70% - 快速、隔离、可重复
- **集成测试**: 20% - 验证组件/服务协作
- **E2E 测试**: 10% - 关键用户流程

---

## 测试框架

### Vitest 配置

**测试运行器**: Vitest ^4.0.0

**配置文件**: `vite.config.ts` (或 `angular.json` 中配置)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 85,
        lines: 80
      }
    }
  }
});
```

### Angular Testing Utilities

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
```

---

## 单元测试规范

### 1. 组件测试

**测试模板**：

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildListComponent } from './build-list';
import { ConfigComponent } from '../../types';

describe('BuildListComponent', () => {
  let component: BuildListComponent;
  let fixture: ComponentFixture<BuildListComponent>;

  const mockComponents: ConfigComponent[] = [
    {
      id: 'frame_road_sl8',
      category: 'Frame',
      name: 'S-Works Tarmac SL8',
      price: 3500,
      weight: 795
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildListComponent);
    component = fixture.componentInstance;
    component.components.set(mockComponents);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display component count', () => {
    fixture.detectChanges();
    const countElement = fixture.nativeElement.querySelector('.component-count');
    expect(countElement.textContent).toContain('1');
  });

  it('should calculate total cost correctly', () => {
    const totalCost = component.totalCost();
    expect(totalCost).toBe(3500);
  });

  it('should emit sync event on save button click', () => {
    const syncSpy = vi.fn();
    component.sync.subscribe(syncSpy);

    fixture.detectChanges();
    const saveButton = fixture.nativeElement.querySelector('#save-btn');
    saveButton.click();

    expect(syncSpy).toHaveBeenCalled();
  });

  it('should show loading state when isSaving is true', () => {
    component.isSaving.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });
});
```

**测试要点**：
- ✅ 组件能否成功创建
- ✅ Input 数据正确渲染
- ✅ Output 事件正确发射
- ✅ 计算属性逻辑正确
- ✅ UI 状态切换（loading、error 等）

---

### 2. 服务测试

**测试模板**：

```typescript
import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase';
import { I18nService } from './i18n';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService]
    });
    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to English', () => {
    expect(service.currentLang()).toBe('en');
  });

  it('should toggle between en and zh-CN', () => {
    service.toggleLang();
    expect(service.currentLang()).toBe('zh-CN');

    service.toggleLang();
    expect(service.currentLang()).toBe('en');
  });

  it('should translate known keys', () => {
    service.currentLang.set('zh-CN');
    expect(service.translate('nav.home')).toBe('首页');
  });

  it('should return key for unknown translations', () => {
    expect(service.translate('unknown.key')).toBe('unknown.key');
  });

  it('should support pipe usage', () => {
    const pipe = service.createPipe();
    expect(pipe.transform('nav.home')).toBe('Home');
  });
});
```

**Mock Firebase**：

```typescript
import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase';

// Mock Firebase SDK
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApp: vi.fn(() => ({}))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn()
  })),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteDoc: vi.fn()
}));

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseService]
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with Google', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: mockUser
    } as any);

    await service.loginWithGoogle();
    expect(service.authState()).toEqual(mockUser);
  });

  it('should handle login error', async () => {
    vi.mocked(signInWithPopup).mockRejectedValueOnce(new Error('Auth failed'));

    await expect(service.loginWithGoogle()).rejects.toThrow('Auth failed');
  });
});
```

---

### 3. 工具函数测试

```typescript
// utils.spec.ts
import { validateConfiguration, calculateWeight } from './utils';

describe('validateConfiguration', () => {
  it('should accept valid configuration', () => {
    const config = {
      bikeType: 'Road',
      name: 'Test Bike',
      components: [],
      totalCost: 1000,
      estimatedWeight: 7.5
    };

    const result = validateConfiguration(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject empty name', () => {
    const config = {
      bikeType: 'Road',
      name: '',
      components: [],
      totalCost: 1000,
      estimatedWeight: 7.5
    };

    const result = validateConfiguration(config);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('should reject invalid bike type', () => {
    const config = {
      bikeType: 'Invalid',
      name: 'Test',
      components: [],
      totalCost: 1000,
      estimatedWeight: 7.5
    };

    const result = validateConfiguration(config);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid bike type');
  });

  it('should reject too many components', () => {
    const config = {
      bikeType: 'Road',
      name: 'Test',
      components: Array(51).fill({}),
      totalCost: 1000,
      estimatedWeight: 7.5
    };

    const result = validateConfiguration(config);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Maximum 50 components allowed');
  });
});

describe('calculateWeight', () => {
  it('should calculate weight with base frame', () => {
    const components = [
      { weight: 1520 },
      { weight: 1370 }
    ];

    const weight = calculateWeight(components, 'Road');
    expect(weight).toBeCloseTo(3.79); // 0.9 + 1.52 + 1.37
  });

  it('should use correct base weight for MTB', () => {
    const weight = calculateWeight([], 'MTB');
    expect(weight).toBe(1.8);
  });

  it('should use correct base weight for Fold', () => {
    const weight = calculateWeight([], 'Fold');
    expect(weight).toBe(2.0);
  });
});
```

---

## 集成测试规范

### 组件交互测试

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { SidebarComponent } from './components/sidebar';
import { PreviewComponent } from './components/preview';

describe('App Component Integration', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update preview when bike type changes', () => {
    // Initial state
    expect(component.activeType()).toBe('Road');

    // Simulate sidebar selection
    const sidebar = fixture.nativeElement.querySelector('app-sidebar');
    const mtbButton = sidebar.querySelector('[data-type="MTB"]');
    mtbButton.click();

    fixture.detectChanges();

    // Verify state update
    expect(component.activeType()).toBe('MTB');

    // Verify preview receives new props
    const preview = fixture.nativeElement.querySelector('app-preview');
    expect(preview.getAttribute('ng-reflect-type')).toBe('MTB');
  });

  it('should open library modal on navbar click', () => {
    expect(component.showLibrary()).toBe(false);

    const navbar = fixture.nativeElement.querySelector('app-navbar');
    const libraryButton = navbar.querySelector('#library-btn');
    libraryButton.click();

    fixture.detectChanges();

    expect(component.showLibrary()).toBe(true);
  });
});
```

---

## E2E 测试规范

### Cypress 配置（可选）

虽然当前项目未配置 E2E 测试，但建议为关键用户流程添加：

**测试场景**：

1. **用户登录流程**
   - 访问应用
   - 点击登录按钮
   - 完成 Google OAuth
   - 验证用户信息显示

2. **配置自行车流程**
   - 选择车型（Road/MTB/Fold）
   - 修改组件
   - 验证价格和重量更新
   - 保存配置

3. **库管理流程**
   - 打开库模态框
   - 查看已保存配置
   - 加载配置到编辑器
   - 删除配置

**示例**（Cypress）：

```typescript
// cypress/e2e/configure-bike.cy.ts
describe('Bike Configuration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should switch bike types', () => {
    cy.get('[data-testid="sidebar-mtb"]').click();
    cy.get('[data-testid="preview-type"]').should('contain', 'MTB');

    cy.get('[data-testid="sidebar-fold"]').click();
    cy.get('[data-testid="preview-type"]').should('contain', 'Fold');
  });

  it('should update total cost when component changes', () => {
    cy.get('[data-testid="total-cost"]').invoke('text').then(initialCost => {
      cy.get('[data-testid="component-selector-btn"]').click();
      cy.get('[data-testid="component-option"]:first').click();
      cy.get('[data-testid="total-cost"]').invoke('text').should('not.eq', initialCost);
    });
  });

  it('should save configuration after login', () => {
    cy.login(); // Custom command
    cy.get('[data-testid="save-btn"]').click();
    cy.get('[data-testid="notification"]').should('contain', 'Saved');
  });
});
```

---

## 测试覆盖率要求

### 覆盖率阈值

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    statements: 80,   // ≥ 80%
    branches: 75,     // ≥ 75%
    functions: 85,    // ≥ 85%
    lines: 80         // ≥ 80%
  }
}
```

### 运行覆盖率检查

```bash
npm run test -- --coverage
```

**生成报告**：
- Text summary in terminal
- HTML report in `coverage/index.html`
- JSON report in `coverage/coverage-final.json`

### 排除文件

以下文件不计入覆盖率：
- `*.spec.ts` (测试文件本身)
- `main.ts`, `main.server.ts` (入口文件)
- `environment.*.ts` (环境配置)
- `*.d.ts` (类型声明)

---

## 测试最佳实践

### ✅ 推荐做法

1. **每个测试独立**：
   ```typescript
   beforeEach(() => {
     // Reset state before each test
     TestBed.resetTestingModule();
   });
   ```

2. **使用描述性测试名称**：
   ```typescript
   it('should emit sync event when save button is clicked', () => {
     // ...
   });
   ```

3. **Arrange-Act-Assert 模式**：
   ```typescript
   it('should calculate total cost', () => {
     // Arrange
     component.components.set([{ price: 100 }, { price: 200 }]);

     // Act
     fixture.detectChanges();
     const total = component.totalCost();

     // Assert
     expect(total).toBe(300);
   });
   ```

4. **Mock 外部依赖**：
   ```typescript
   providers: [
     { provide: FirebaseService, useClass: MockFirebaseService }
   ]
   ```

5. **测试边界条件**：
   ```typescript
   it('should handle empty component list', () => {
     component.components.set([]);
     expect(component.totalCost()).toBe(0);
   });

   it('should handle maximum components (50)', () => {
     const maxComponents = Array(50).fill(mockComponent);
     component.components.set(maxComponents);
     expect(component.components().length).toBe(50);
   });
   ```

### ❌ 避免的做法

1. **测试实现细节**：
   ```typescript
   // ❌ Bad - Testing internal state
   expect(component['privateMethod']()).toBe(...);

   // ✅ Good - Testing public API
   expect(component.publicMethod()).toBe(...);
   ```

2. **硬编码魔法数字**：
   ```typescript
   // ❌ Bad
   expect(result).toBe(3.79);

   // ✅ Good
   const expectedWeight = BASE_WEIGHTS.Road + COMPONENT_WEIGHTS.reduce((sum, w) => sum + w, 0);
   expect(result).toBeCloseTo(expectedWeight);
   ```

3. **测试之间共享状态**：
   ```typescript
   // ❌ Bad - Test order dependent
   it('test 1', () => {
     component.count.set(5);
   });

   it('test 2', () => {
     expect(component.count()).toBe(5); // Depends on test 1
   });
   ```

---

## 持续集成中的测试

### GitHub Actions 示例

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests with coverage
        run: npm run test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

---

## 测试清单

在提交 PR 前，确保：

- [ ] 所有新代码都有对应的单元测试
- [ ] Bug 修复包含回归测试
- [ ] 测试覆盖率满足阈值要求
- [ ] 所有测试通过（`npm run test`）
- [ ] Lint 检查通过（`npm run lint`）
- [ ] 没有 `console.log` 或 `fit`/`fdescribe`（focused tests）
- [ ] Mock 数据合理且可维护
- [ ] 测试名称清晰描述行为

---

## 相关文档

- [开发规范](./coding-standards.md)
- [架构概览](../architecture/overview.md)
- [API 规范](../api/firestore.md)
