# Implementation Progress

Snapshot date: July 21, 2026

## Current Status

The project is currently in the foundation and authentication stage.

What is working today:

- Nx monorepo with separate `backend`, `frontend`, and shared `libs/shared` workspace packages
- Express + TypeScript backend with JWT authentication
- React + Vite frontend with login, registration, protected routing, and authenticated layout
- MongoDB-backed user model and seed script for local development
- Shared TypeScript types and constants consumed by both apps

What is not built yet:

- Maintenance request domain models
- Maintenance request API endpoints
- Maintenance request UI flows for tenants and managers
- Feature-specific tests for the maintenance request workflow

## Completed So Far

### 1. Monorepo foundation

The codebase is organized as an Nx workspace so frontend, backend, and shared code can evolve together with consistent tooling.

- `apps/backend`: Express API
- `apps/frontend`: React client
- `libs/shared`: reusable types, constants, and utilities
- `tsconfig.base.json`: root TypeScript path alias configuration

### 2. Backend authentication system

The backend already supports the core auth flow:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/refresh`

Supporting pieces already in place:

- JWT token generation and verification
- role-aware authorization middleware
- Zod request validation
- centralized error handling
- request rate limiting
- Helmet and CORS middleware
- MongoDB connection and seed script

### 3. Frontend authentication flow

The frontend currently includes:

- login page
- registration page
- auth context with persisted session state
- protected routes
- shared layout shell
- placeholder dashboard and analytics pages

This means the application already demonstrates sign-up, sign-in, session persistence, and guarded navigation.

### 4. Shared library extraction

Recent work introduced a shared workspace package at `libs/shared` to remove duplicated auth and API contracts across frontend and backend.

Shared items now include:

- `User`, `AuthResponse`, `ApiResponse`, `LoginFormData`, `RegisterFormData`
- `UserRole`, `USER_ROLES`, `DEFAULT_USER_ROLE`
- auth storage keys
- default API base path and request timeout
- user utilities like `normalizeEmail`

This improves consistency by letting both apps use the same source of truth for:

- role definitions
- request/response shapes
- local storage keys
- email normalization behavior

## Recent Changes Reflected In Code

The latest in-progress changes primarily tighten cross-app consistency:

- backend auth middleware now uses shared `UserRole` types
- backend user model and validation now use shared role constants
- backend auth service now normalizes email addresses before lookup and registration
- frontend registration schema now uses shared role constants
- frontend API and auth services now use shared storage keys and API constants
- frontend local type definitions were replaced with re-exports from `@doorloop/shared`
- workspace TypeScript config and Vite aliasing were updated so both apps can resolve the shared library

## Recommended Next Steps

The next logical implementation phase is the maintenance request system described in `PROJECT_REQUIREMENTS.md`.

Recommended order:

1. Add shared maintenance-request types and enums to `libs/shared`
2. Create backend maintenance-request model, validation, service, controller, and routes
3. Enforce tenant vs manager access rules in API handlers
4. Build tenant and manager request screens in the frontend
5. Add tests for request lifecycle rules and role-based permissions

## Useful Files

- `README.md`
- `PROJECT_REQUIREMENTS.md`
- `apps/backend/src/routes/auth.ts`
- `apps/backend/src/services/authService.ts`
- `apps/frontend/src/contexts/AuthContext.tsx`
- `apps/frontend/src/pages/LoginPage.tsx`
- `apps/frontend/src/pages/RegisterPage.tsx`
- `libs/shared/src/index.ts`
