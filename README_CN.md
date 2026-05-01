# Veloform 自行车装车配置器

[English Version](./README.md)

Veloform 是一款基于 Angular、Tailwind CSS 并由 Firebase 驱动的高级自行车配置器应用。它允许用户浏览和定制不同类别自行车的配置清单，包括公路车 (Road)、山地车 (MTB) 和折叠车 (Fold)。

## 功能特点

- **极简深色 UI**: 采用现代风格的暗色主题，深度依赖平滑的过渡效果与清晰的排版设计。
- **实时价格与重量计算**: 动态计算并展示整车造价及预计重量。
- **配置云同步**: 深度集成 Firebase Firestore，安全留存用户的独家配置方案。
- **车型分类**: 在公路车、山地车和折叠车间无缝瞬间切换。
- **完美响应式**: 贯彻移动端优先范式，但保留毫不妥协的桌面端设计美学体验。

## 架构

本项目架构栈如下：
- **Angular (v21)**: 采用无 Zone.js 的全新响应式 (`signals`) 范式和独立组件。
- **Tailwind CSS (v4)**: 用于全面构建布局结构、文字排版及交互反馈态。
- **Firebase**: 利用 `firebase` npm 包管理 Firestore 数据库与 Auth 身份验证。
- **EdgeOne & Vercel**: 预留边缘部署工作流 (UI 端整合呈现)。

## 本地开发指南

确保已设置你的 Firebase 运行时环境变量，然后执行：

```bash
npm run dev
```

## 目录结构

- `src/app/`
  - `components/`: UI 核心组件 (包括 `navbar`, `sidebar`, `preview`, `build-list`)
  - `services/`: 业务逻辑及 Firebase 状态聚合类
  - `types.ts`: TS 强类型定义
  - `app.ts` & `style.css`: 根组件与全量全局样式体系。

## 版本信息

当前运行版本 **v3.1.1**.
