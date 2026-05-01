# Veloform Bike Configurator

[中文版本 (Chinese Version)](./README_CN.md)

Veloform is an advanced, sophisticated bicycle configurator application built with Angular, Tailwind CSS, and powered by Firebase. It allows users to browse and customize configurations for different types of bicycles, including Road, Mountain (MTB), and Folding bikes.

## Features

- **Sophisticated UI**: Dark-themed, modern interface heavily reliant on smooth transitions and crisp typography.
- **Real-time Price & Weight**: Live calculation of total build cost and estimated weight.
- **Configuration Syng**: Fully integrated with Firebase Firestore to save and sync your builds.
- **Categorization**: Switch seamlessly between Road, MTB, and Fold presets.
- **Responsive Design**: Designed with mobile-first adaptivity but desktop-class aesthetics.

## Architecture

This project is built using:
- **Angular (v21)**: Taking full advantage of zoneless reactivity (`signals`) and standalone components.
- **Tailwind CSS (v4)**: For all layout, typography, and interactive state stylings.
- **Firebase**: Uses Firestore and Auth via the `firebase` npm package.
- **EdgeOne & Vercel**: Ready for edge deployment logic (simulated in UI).

## Local Development

Ensure you have your Firebase environment variable set, then run:

```bash
npm run dev
```

## Structure

- `src/app/`
  - `components/`: UI components (`navbar`, `sidebar`, `preview`, `build-list`)
  - `services/`: Core logic and Firebase integration
  - `types.ts`: Typings
  - `app.ts` & `style.css`: The root application logic and global styles.

## Versioning

Currently running version **v3.1.1**.
