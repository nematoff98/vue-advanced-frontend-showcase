# Advanced Vue 3 Enterprise Architecture 🚀

This repository showcases a professional, scalable, and highly structured **Vue 3** application built with **TypeScript**. The architecture is designed for large-scale projects, emphasizing modularity, automated scaffolding, and clean code principles.

## 🛠 Tech Stack
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Pinia
- **Styling:** Tailwind CSS / SCSS
- **HTTP Client:** Axios with custom Service Layer
- **Real-time:** Pusher Integration
- **Validation:** Vee-Validate
- **Linting:** ESLint & Prettier

## 🏗 Project Architecture & Directory Structure

The project follows a modular design pattern to ensure separation of concerns:

- **`src/views`**: Page-level components and routing entry points.
- **`src/components`**: Reusable UI components.
- **`src/composables`**: Encapsulated business logic and stateful functions.
- **`src/layouts`**: Global application shells (e.g., `default.vue`).
- **`src/services`**: A robust data-access layer (see [Service Pattern](#-service-pattern) for details).
- **`src/plugins`**: Third-party library configurations (Pusher, Vee-validate, etc.).
- **`src/store`**: Pinia modules for global state management.
- **`src/utils`**: Helper functions, constants, formatting, and permission logic.

---

## 💎 Key Features & Engineering Excellence

### 📂 Service Pattern (Data Layer)
Each module in the `services/` directory is standardized to ensure consistency:
- `*.interface.ts`: Strongly typed data models.
- `*.list.ts`: Enums and constant lists.
- `*.service.ts`: API request logic.
- `*.mapper.ts`: Data transformation logic (Backend to Frontend model mapping).
- `index.ts`: Unified export point for the module.

### ⚙️ Automated Scaffolding
To maintain architectural integrity, the project includes a custom service generator. This prevents manual errors and speeds up development.
- **Command:** `npm run generate-service`
- **Tooling:** Powered by `generate-template-files`, creating a complete service folder with all necessary boilerplate files instantly.

### 🛡 Core API Service (`api.service.ts`)
A centralized Axios wrapper that handles:
- Base URL configuration via Environment Variables.
- Global request/response interceptors.
- Centralized **Error Handling** (e.g., 401 Unauthorized redirect to login).
- Type-safe CRUD operations (GET, POST, PUT, DELETE).

