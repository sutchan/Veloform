# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0]
### Added
- Created `app.constants.ts` to separate logic from default data arrays.
- Implemented language toggle within navigation UI.

## [3.0.0]
### Added
- Integrated Three.js 3D model visualizer in the preview component replacing the SVG mock.
- Full Firebase configurations library: save, view, edit, and delete functions.
- Centralized component database via Firestore instead of local constants.

## [2.0.0]
### Changed
- Refactored components to fully embrace Angular v21 Zoneless pattern.
- Extracted strings to i18n service supporting English and Chinese.
- Injected semantic DOM IDs for core containers matching conventions.
- Included comprehensive JSON-LD structure in document header.
- Updated to latest architectural specification standard.

## [1.0.0]
### Added
- Initial setup of Veloform Bike Configurator.
- Firebase integration for cloud configurations sync.
- Tailwind CSS Sophisticated Dark themed interface.
- Responsive layout with Sidebar, Preview Canvas, and Configuration List.
- Support for Road, MTB, and Fold categories.
