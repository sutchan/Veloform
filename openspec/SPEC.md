# Veloform Configurator OpenSpec (v3.1.0)

## 1. Project Overview
Veloform is a localized (EN/ZH), high-performance bicycle configurator designed for cyclists to simulate custom builds across Road, MTB, and Folding bike categories.

## 2. Technical Stack
- **Framework**: Angular v21+ (Zoneless architecture, Signal-based state management).
- **Styling**: Tailwind CSS v4 (Mobile-first, Dark/Light mode support).
- **Backend**: Firebase (Firestore, Authentication, Security Rules).
- **3D Visualization**: Three.js (Procedural 3D scene rendering in the preview background).
- **L11n**: Custom Signal-based I18n service.

## 3. Core Architecture
- **State Flow**: Unidirectional data flow using Angular Signals. The root component (`app.ts`) maintains the active configuration, which is distributed to components via inputs.
- **Directory Structure**:
  - `app/components/`: Modular UI atoms (Navbar, Sidebar, Build-List, Preview).
  - `app/services/`: Core logic (Firebase, I18n).
  - `app/types.ts`: Centralized Type definitions.
  - `app/app.constants.ts`: Static default data for bikes.

## 4. Data Models
### Entity: ConfigComponent
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier. |
| `category` | `string` | Component category (e.g., Drivetrain). |
| `name` | `string` | Display name. |
| `price` | `number` | USD cost. |
| `weight` | `number` | Weight in grams. |

### Entity: Configuration
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string?` | Firestore Document ID. |
| `userId` | `string` | Owner's UID. |
| `name` | `string` | User's build name. |
| `bikeType` | `string` | Road / MTB / Fold. |
| `components` | `Array` | List of selected IDs or full objects. |
| `totalCost` | `number` | Aggregated cost. |
| `totalWeight` | `number` | Aggregated weight. |

## 5. Security & Access Control
- **Persistence**: Managed via Firestore Security Rules.
- **Rule Logic**: 
  - `read`: Allowed if `resource.data.userId == request.auth.uid`.
  - `create`: requires authenticated session, `request.resource.data.userId == request.auth.uid`, and strict schema validation.
  - `update/delete`: Only the document owner can modify their record.

## 6. Features
- **3D Preview**: Dynamically adjusted Three.js lights and materials based on the selected `bikeType`.
- **Zoneless Performance**: Leverages Angular 21's new Change Detection strategy for sub-millisecond UI updates.
- **Persistence**: Google Login integration for saving builds to a global dashboard.
- **Theming**: Integrated system-aware dark/light mode toggle.
