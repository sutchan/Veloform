# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.1]
### Added
- Dynamic project ID based on bike type and configuration ID in navbar

### Fixed
- Moved test files to correct locations (core/services/)

### Changed
- Updated navbar component to use computed signals for project ID
- Test file imports updated to relative paths

## [3.3.0]
### Added
- Feature-Based architectural refactoring (Core/Features/Shared layers)
- `_redirects` and `_headers` files for EdgeOne Pages SPA deployment
- Comprehensive SEO/GEO meta tags and JSON-LD structured data
- Enhanced responsive CSS with mobile-first design
- Semantic HTML IDs and ARIA accessibility attributes

### Fixed
- Loading Indicator component layout stability
- Modal background click-to-close functionality
- Navigation links with invalid href="#" attributes
- Confirm dialog z-index layering
- Firebase environment variable type safety

## [3.2.0]
### Added
- New SVG logo and favicon with bicycle frame geometry design.
- Component selector modal dialog for editing bike parts.
- Notification system with toast-style notifications.
- Confirm dialog service for user confirmation prompts.
- Loading indicator component for async operations.
- ConfigStore and ConfigService for centralized state management.
- Routing system with /config/:id route for sharing builds.
- Enhanced type definitions with complete JSDoc comments.

## [3.1.1]
### Fixed
- Synchronized version numbers across SPEC.md and index.html title tag.

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
