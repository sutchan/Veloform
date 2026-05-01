# Veloform Configurator OpenSpec (v3.1.0)

## 1. Project Overview

Veloform is a localized (EN/ZH), high-performance bicycle configurator designed for cyclists to simulate custom builds across **Road**, **MTB**, and **Folding** bike categories. It features real-time 3D procedural visualization, Firebase-backed persistence, and server-side rendering for SEO.

- **Production URL**: `https://veloform.app`
- **Repository**: `https://github.com/sutchan/Veloform`

---

## 2. Technical Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Angular (Zoneless, Signal-based) | ^21.0.0 |
| **Language** | TypeScript | ~5.9.2 |
| **Styling** | Tailwind CSS (Mobile-first) | ^4.1.12 |
| **Backend / DB** | Firebase (Firestore, Auth) | ^12.12.1 |
| **3D Rendering** | Three.js (Procedural WebGL) | ^0.184.0 |
| **SSR Runtime** | Express + Angular SSR | ^5.1.0 / ^21.0.0 |
| **Animation** | Motion | ^12.23.24 |
| **AI Integration** | Google GenAI SDK | ^1.27.0 |
| **Linting** | ESLint + angular-eslint | ^9.39.1 / 21.1.0 |
| **Testing** | Vitest | ^4.0.0 |
| **Deployment** | Vercel (Angular framework preset) | — |
| **I18n** | Custom Signal-based I18n service | — |

---

## 3. Core Architecture

### 3.1 State Flow

Unidirectional data flow using **Angular Signals**. The root component (`app.ts`) maintains the active configuration state, distributed to child components via `input()` / `output()` decorators.

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

### 3.2 Directory Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar.ts          # Top navigation bar (auth, theme, language, library trigger)
│   │   ├── sidebar.ts         # Bike type selector (Road / MTB / Fold)
│   │   ├── preview.ts         # 3D Three.js preview + stats footer
│   │   └── build-list.ts      # Component list panel + sync/deploy actions
│   ├── services/
│   │   ├── firebase.ts        # Firestore CRUD, Auth, error handling, component seeding
│   │   └── i18n.ts            # Signal-based translation pipe & helper functions
│   ├── app.ts                 # Root component (state management, layout orchestration)
│   ├── app.config.ts          # Browser application config (router, error listeners)
│   ├── app.config.server.ts   # Server application config (SSR with prerender)
│   ├── app.routes.ts          # Client-side route definitions (currently empty — SPA)
│   ├── app.routes.server.ts   # Server route definitions (prerender all paths)
│   ├── app.constants.ts       # Static default component data per bike type
│   ├── types.ts               # Centralized TypeScript interfaces
│   ├── style.css              # Component-scoped styles + Tailwind @theme tokens
│   └── app.spec.ts            # Root component unit tests
├── main.ts                    # Browser bootstrap entry
├── main.server.ts             # SSR bootstrap entry
├── server.ts                  # Express server for Node.js SSR
├── styles.css                 # Global styles (Tailwind import, Material Icons)
├── index.html                 # HTML shell (SEO meta, JSON-LD, OG tags)
└── globals.d.ts               # Global type declarations
```

### 3.3 Change Detection

All components use `ChangeDetectionStrategy.OnPush` for optimal performance. Angular 21's zoneless architecture eliminates Zone.js overhead, enabling sub-millisecond UI updates.

---

## 4. Data Models

### 4.1 Entity: ConfigComponent

Represents a single bicycle component within a configuration.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique identifier (e.g., `'frame_road_sl8'`) |
| `category` | `string` | Yes | Component category (e.g., `Drivetrain`, `Wheelset`, `Frame`, `Suspension`, `Cockpit`, `Tires`) |
| `name` | `string` | Yes | Display name (e.g., `'Shimano Dura-Ace Di2 R9200'`) |
| `price` | `number` | Yes | Cost in USD |
| `weight` | `number` | Yes | Weight in **grams** |
| `bikeType` | `string?` | No | Associated bike type (`'Road'` / `'MTB'` / `'Fold'`). Used in DB components. |

### 4.2 Entity: Configuration

Represents a user's saved bicycle build.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string?` | No | Firestore Document ID (auto-generated via `crypto.randomUUID()`) |
| `userId` | `string?` | No | Owner's Firebase Auth UID (set server-side on save) |
| `bikeType` | `'Road' \| 'MTB' \| 'Fold'` | Yes | Bike category |
| `name` | `string` | Yes | Build name (e.g., `'S-Works Tarmac SL8'`) |
| `components` | `ConfigComponent[]` | Yes | Selected components list (max 50 items) |
| `totalCost` | `number` | Yes | Aggregated cost in USD |
| `estimatedWeight` | `number` | Yes | Aggregated weight in **kg** (includes base frame weight) |
| `createdAt` | `Timestamp?` | No | Firestore server timestamp (set on create) |
| `updatedAt` | `Timestamp?` | No | Firestore server timestamp (set on every save) |

### 4.3 Entity: DatabaseComponent (Firestore `components` collection)

Global component dictionary stored in Firestore, seeded on first access.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Document ID (e.g., `'frame_road_sl8'`) |
| `category` | `string` | Yes | Component category |
| `bikeType` | `string` | Yes | Associated bike type |
| `name` | `string` | Yes | Display name |
| `price` | `number` | Yes | Cost in USD |
| `weight` | `number` | Yes | Weight in grams |
| `specs` | `string` | Yes | Specification string (e.g., `'Carbon Fact 12r'`) |

---

## 5. Firestore Schema & Security Rules

### 5.1 Collections

| Collection | Purpose | Access |
| :--- | :--- | :--- |
| `components/{componentId}` | Global component dictionary | Public read; open write (demo seeding) |
| `configurations/{configurationId}` | User bike configurations | Owner-only CRUD |

### 5.2 Security Rules Summary

- **Default**: All paths deny read/write (`allow read, write: if false`).
- **`/components`**: `get` requires valid ID format; `list` is public; `write` is open (demo mode for seeding).
- **`/configurations`**:
  - `get`: Authenticated + owner match (`resource.data.userId == request.auth.uid`).
  - `list`: Authenticated + owner match.
  - `create`: Authenticated + valid ID + strict schema validation (8 required fields, `bikeType` enum check, component array validation up to 10 items, timestamp enforcement).
  - `update`: Authenticated + owner + immutable `userId`/`createdAt` + `updatedAt` refresh + restricted `affectedKeys`.
  - `delete`: Authenticated + owner.
- **Schema Validation**: `isValidConfiguration()` enforces exact 8-key schema, string length limits (ID ≤128, name ≤200), numeric types for cost/weight, and `bikeType` enum `['Road', 'MTB', 'Fold']`.

---

## 6. Services

### 6.1 Firebase Service (`services/firebase.ts`)

| Function | Description |
| :--- | :--- |
| `loginWithGoogle()` | Google OAuth popup sign-in |
| `saveConfiguration(config)` | Upsert configuration to Firestore (create or merge-update) |
| `getUserConfigurations()` | Query user's configurations by `userId` |
| `deleteConfiguration(id)` | Delete a configuration document |
| `getComponentsFromDB()` | Fetch all components; auto-seeds if collection is empty |
| `handleFirestoreError(error, op, path)` | Structured error logging with operation type, path, and auth context |

**Error Handling Pattern**: All Firestore operations are wrapped in try/catch. Errors are serialized into a structured `FirestoreErrorInfo` object (error message, operation type, path, auth info) and re-thrown.

**Component Seeding**: On first access, if the `components` collection is empty, `seedComponents()` writes 11 default components (4 Road, 4 MTB, 3 Fold) with specs data.

### 6.2 I18n Service (`services/i18n.ts`)

- **Supported Languages**: `en`, `zh-CN`
- **Mechanism**: Signal-based (`currentLang` signal) with a `TPipe` Angular pipe for template usage.
- **Translation Keys**: 36 keys organized by namespace (`nav.*`, `sidebar.*`, `preview.*`, `build.*`, `garage.*`, `sync.*`, `deploy.*`).
- **Toggle**: `toggleLang()` switches between `en` ↔ `zh-CN`.
- **Fallback**: Returns the raw key string if no translation is found.

---

## 7. Component Architecture

### 7.1 NavbarComponent (`components/navbar.ts`)

- **Responsibilities**: Brand logo, navigation links (Configurator, Library, Specs, Deployment), theme toggle (Dark/Light via `document.documentElement.classList`), language toggle, user avatar/login button, project ID display.
- **Outputs**: `openLibrary` — triggers the Garage modal.
- **Auth Integration**: Listens to `onAuthStateChanged` to display user avatar or login button.

### 7.2 SidebarComponent (`components/sidebar.ts`)

- **Responsibilities**: Vertical bike type selector with icon buttons for Road, MTB, Fold.
- **Inputs**: `activeType` — current bike type.
- **Outputs**: `typeSelected` — emits selected bike type.
- **Accessibility**: `tabindex`, `keydown.enter` handlers, `focus-visible` ring styling.
- **Responsive**: Hidden on mobile (`hidden md:flex`); replaced by horizontal button group in root template.

### 7.3 PreviewComponent (`components/preview.ts`)

- **Responsibilities**: 3D procedural bike visualization + build stats footer.
- **Inputs**: `name`, `type`, `weight`, `cost`.
- **Three.js Scene**:
  - WebGL renderer with antialiasing and alpha transparency.
  - PerspectiveCamera (FOV 45°, positioned at `[2, 1, 3]`).
  - Ambient light (0.6 intensity) + directional light (1.5 intensity).
  - Procedural bike mesh: 2 torus wheels, 5 cylinder frame tubes (top, down, seat, chainstay, seatstay), fork, handlebars.
  - Bike type variations: MTB gets wider handlebars and thicker down tube; Fold gets longer seat tube, shorter fork, angled top tube, smaller wheels.
  - Continuous Y-axis rotation animation (`0.005 rad/frame`).
  - Window resize handler for responsive canvas.
- **Stats Footer**: Estimated weight (kg), aerodynamic drag (watts, cost-dependent mock), total cost (USD).
- **Platform Safety**: All Three.js code guarded by `isPlatformBrowser()` to prevent SSR crashes.

### 7.4 BuildListComponent (`components/build-list.ts`)

- **Responsibilities**: Displays selected component list with category, name, weight, price; sync and deploy action buttons.
- **Inputs**: `components`, `isSaving`.
- **Outputs**: `sync` (save to Firebase), `deploy` (mock Vercel deployment).
- **Layout**: Scrollable component list + fixed bottom action panel.

---

## 8. Features

### 8.1 3D Preview

Procedural Three.js scene that dynamically adjusts materials, geometry scale, and wheel size based on the selected `bikeType`. The bike mesh is rebuilt via `effect()` whenever the type signal changes.

### 8.2 Bike Type Switching

Three bike categories with distinct default component sets and base frame weights:

| Type | Default Name | Base Frame Weight | Default Components |
| :--- | :--- | :--- | :--- |
| Road | S-Works Tarmac SL8 | 900g | 4 components (Drivetrain, Wheelset, Cockpit, Tires) |
| MTB | Epic World Cup | 1800g | 4 components (Drivetrain, Suspension, Wheelset, Tires) |
| Fold | Brompton T Line | 2000g | 3 components (Drivetrain, Frame, Wheelset) |

On type switch, the app first attempts to load DB-filtered components; falls back to static defaults.

### 8.3 Garage (Library Modal)

Full-screen overlay modal displaying the user's saved configurations as cards. Supports:
- Loading a saved configuration into the editor.
- Deleting configurations with confirmation dialog.
- Auth-gated access (shows login prompt or empty state).
- Auto-refreshes on open via `effect()`.

### 8.4 Persistence (Firebase)

- Google OAuth sign-in via popup.
- Configurations saved to Firestore with upsert logic (`setDoc` with `merge: true`).
- Auto-generates document ID via `crypto.randomUUID()`.
- Server timestamps for `createdAt` / `updatedAt`.

### 8.5 Theming

- Dark/Light mode toggle in Navbar.
- Implemented via `document.documentElement.classList.add/remove('dark')`.
- Default state: Dark (HTML root has `class="dark"`).
- CSS custom properties defined in `style.css` via `@theme` directive for light mode tokens.

### 8.6 Server-Side Rendering (SSR)

- Angular SSR with Express runtime (`src/server.ts`).
- Prerender mode for all routes (`RenderMode.Prerender` on `path: '**'`).
- Static assets served with 1-year cache (`maxAge: '1y'`).
- Fallback to Angular rendering for non-static routes.
- Platform-safe guards (`isPlatformBrowser()`) in Three.js and DOM-dependent code.

### 8.7 SEO & Generative Engine Optimization (GEO)

- `<title>` tag with version number.
- Open Graph meta tags (`og:title`, `og:description`, `og:type`).
- Canonical URL (`https://veloform.app`).
- JSON-LD structured data (`WebApplication` schema).

---

## 9. Deployment

### 9.1 Vercel

Configured via `vercel.json`:
- Framework: `angular`
- Build command: `npm run build`
- Output directory: `dist/app/browser`
- SPA rewrite: all routes → `/index.html`

### 9.2 Environment Variables

| Variable | Purpose |
| :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini AI API key (injected at runtime) |
| `APP_URL` | Application host URL (injected at runtime for OAuth callbacks) |

### 9.3 Build Budgets

| Type | Warning | Error |
| :--- | :--- | :--- |
| Initial bundle | 1.5 MB | 2 MB |
| Component style | 4 kB | 8 kB |

---

## 10. Development

### 10.1 Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Start Angular dev server |
| `npm run dev` | Dev server on port 3000 with HMR and Gemini API injection |
| `npm run build` | Production build |
| `npm run watch` | Development build with watch mode |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | ESLint check |
| `npm run serve:ssr:app` | Run Node.js SSR server |

### 10.2 Linting

ESLint with `typescript-eslint` + `angular-eslint`:
- Component selectors: `element`, prefix `app`, kebab-case.
- Directive selectors: `attribute`, prefix `app`, camelCase.
- Template accessibility checks enabled.

### 10.3 Code Conventions

- 使用 Angular standalone 组件，保持设计松耦合。
- 组件默认使用 `OnPush` 变更检测。
- UI 状态尽量采用 `signals`，非必要时不引入 RxJS 作为组件局部状态管理。
- `app-` 前缀组件选择器，文件名和类名保持一致并使用 `kebab-case`。
- 服务层应使用 dependency injection，不使用全局可变状态。
- 代码风格应遵循 ESLint 规则，提交前执行 `npm run lint`。
- 每个组件 / 服务文件建议配套 `*.spec.ts` 单元测试。
- 语义化 HTML 与可访问性属性（如 `aria-label`、`role`）应作为首选方案。
- Tailwind CSS 采用移动优先响应式设计，避免内联样式和过度嵌套。
- 所有公共导出函数与类应补充简洁 JSDoc 注释。

### 10.4 Development Workflow

- 使用 `feature/`, `fix/`, `docs/`, `hotfix/` 等语义化分支命名。
- 提交信息应使用 `<type>(<scope>): <description>` 格式。
- 新增功能或修复应附带对应测试。
- 文档和规范改动应同步更新 `README.md`, `README_CN.md`, `PROJECT_GUIDELINES.md` 或 `IMPROVEMENTS.md`。
