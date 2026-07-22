# DoorLoop Technical Assessment - Maintenance Tracker

> **⚠️ Important**: Before setting up the project, please read the [ASSIGNMENT_DESCRIPTION.md](ASSIGNMENT_DESCRIPTION.md) first to understand the assessment requirements and context.

## Overview

This repository contains a fullstack maintenance request tracking system built as an **Nx monorepo**. Tenants can submit and review their own maintenance requests, while managers and admins can work the shared queue, update request workflow details, and manage operational follow-up.

## Current Status

As of July 22, 2026, the core maintenance tracking feature set is implemented.

- Completed: authentication, tenant request submission, tenant request history, manager/admin queue views, status updates, priority updates, admin assignment controls, delete flows, role-based access control, Docker/dev tooling, and a shared library for cross-app types/constants
- In progress: production hardening, deployment documentation, and final cleanup of remaining lint warnings

For a focused summary of what has been built so far, see [docs/IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md).

## Architecture

- **Monorepo**: Nx workspace for scalable development
- **Backend**: Node.js + TypeScript + Express + MongoDB + Typegoose
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with role-based access control
- **Domain**: Maintenance request workflow with role-aware queue management
- **Containerization**: Docker and Docker Compose
- **Build System**: Nx with caching and dependency graph management

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Quick Start with Docker

1. **Clone and start the application**:

   ```bash
   git clone <repository-url>
   cd technical-fullstack-assessment

   # Install dependencies
   npm i
   npm i -g nx


   # Start all services
   npm run docker:up
   # or
   docker compose up -d
   ```

2. **Seed the database**:

   ```bash
   # Wait for services to be ready, then seed
   make seed
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Local Development Setup

1. **Install dependencies**:

   ```bash
   make install
   # or
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp apps/backend/env.example apps/backend/.env
   # Edit the .env file with your MongoDB connection string and JWT settings
   ```

3. **Start MongoDB** (if running locally):

   ```bash
   # Using Docker for MongoDB only
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

4. **Start development servers**:

   ```bash
   npm run dev
   ```

5. **Seed the database**:
   ```bash
   npm run seed
   ```

## Environment Variables

### Backend

Create `apps/backend/.env` with values appropriate for your environment.

- `PORT`: backend port, typically `3001`
- `MONGODB_URI`: MongoDB Atlas or local Mongo connection string
- `JWT_SECRET`: long random secret for signing JWTs
- `JWT_EXPIRES_IN`: token lifetime such as `7d`
- `FRONTEND_URL`: allowed frontend origin for CORS

### Frontend

Set the frontend API origin before production builds:

- `VITE_API_URL`: backend API base URL, for example `https://your-backend.example.com/api`

## Available Scripts

### Docker Commands

- `npm run docker:up` - Start all services with Docker
- `npm run docker:down` - Stop all Docker services
- `npm run docker:build` - Build Docker images
- `npm run seed` - Seed the database with initial data

### Nx Development Commands

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications
- `npm run test` - Run tests for both applications
- `npm run lint` - Lint all applications
- `npm run verify:commit` - Run the same lint and test checks enforced before each commit
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run graph` - Show project dependency graph
- `npm run affected` - Show affected projects

### Individual Project Commands

- `nx dev backend` - Start only the backend
- `nx dev frontend` - Start only the frontend
- `nx build backend` - Build only the backend
- `nx build frontend` - Build only the frontend
- `nx test backend` - Test only the backend
- `nx test frontend` - Test only the frontend
- `nx lint backend` - Lint only the backend
- `nx lint frontend` - Lint only the frontend

### Nx Affected Commands (for CI/CD)

- `nx affected --target=build` - Build only affected projects
- `nx affected --target=test` - Test only affected projects
- `nx affected --target=lint` - Lint only affected projects

## Commit Guardrail

Git commits are protected by `lefthook` via the tracked [lefthook.yml](/Users/margaretbehm/Desktop/technical-fullstack-assessment-main/lefthook.yml:1) config.

- The `pre-commit` hook runs `npm run verify:commit`, which executes the workspace lint and test suites.
- `npm install` automatically runs `npm run prepare`, which calls `lefthook install` for the local clone.
- If you need to re-enable hooks manually in an existing clone, run `npm run prepare`.

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: admin@doorloop.com / admin123
- **Manager**: manager@doorloop.com / manager123
- **Tenant**: tenant@doorloop.com / tenant123

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (authenticated)
- `POST /refresh` - Refresh token (authenticated)

### Maintenance Requests (`/api/maintenance-requests`)

- `GET /` - Get the authenticated tenant's maintenance requests
- `POST /` - Submit a new maintenance request as a tenant
- `GET /all` - Get the full maintenance queue as a manager or admin
- `PATCH /:id/status` - Update request status as a manager or admin
- `PATCH /:id/priority` - Update request priority as a manager or admin
- `PATCH /:id/assign` - Assign a request as an admin
- `DELETE /:id` - Delete a request as a manager or admin

### Users (`/api/users`)

- `GET /assignable` - Get assignable admins and managers for request routing

## User Roles

- **Admin**: Full system access
- **Manager**: Queue visibility, status updates, priority updates, and delete access
- **Tenant**: Request submission and self-service request history

## Maintenance Features

### Tenant Experience

- Submit a maintenance request with title, description, priority, and property/unit identifier
- View all personal maintenance requests
- See request creation and completion timestamps
- Receive inline feedback on request submission failures

### Manager/Admin Experience

- View all maintenance requests across the portfolio
- Filter the queue by status and priority
- Update request status through the allowed workflow
- Update request priority
- Delete maintenance requests
- See queue-level load failures instead of misleading empty states

### Admin-Only Controls

- Assign requests to admins or managers from the queue workspace

## Project Structure

```
technical-fullstack-assessment/
├── apps/
│   ├── backend/                 # Node.js + Express API
│   │   ├── src/
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── models/          # Mongoose/Typegoose models
│   │   │   ├── routes/          # Express routes
│   │   │   ├── middleware/      # Custom middleware
│   │   │   ├── services/        # Business logic services
│   │   │   ├── utils/           # Utility functions
│   │   │   └── scripts/         # Database seeding scripts
│   │   └── package.json
│   └── frontend/                # React + TypeScript UI
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── pages/           # Page components
│       │   ├── contexts/        # React contexts
│       │   ├── services/        # API services
│       │   ├── types/           # TypeScript type definitions
│       │   └── utils/           # Utility functions
│       └── package.json
├── docker-compose.yml           # Docker services configuration
├── init-mongo.js               # MongoDB initialization
├── Makefile                    # Development commands
└── package.json                # Root package.json
```

## Nx Monorepo Benefits

This project uses **Nx** for advanced monorepo management, providing:

- 🚀 **Smart Rebuilds**: Only builds what changed
- 📊 **Dependency Graph**: Visual representation of project relationships
- ⚡ **Parallel Execution**: Run tasks across multiple projects simultaneously
- 🎯 **Affected Commands**: Test/build/lint only what's affected by changes
- 📦 **Code Sharing**: Easy sharing of libraries between apps
- 🔧 **Consistent Tooling**: Unified configuration across all projects
- 📈 **Scalability**: Easy to add new apps and libraries

### Nx Commands for Development

```bash
# See what's affected by your changes
nx affected --target=build --dry-run

# Run tests only for affected projects
nx affected --target=test

# Visualize the dependency graph
nx graph

# Run a specific target for all projects
nx run-many --target=lint --projects=backend,frontend
```

## Testing

The project includes lightweight but meaningful frontend and backend unit tests covering:

- auth flows and auth-service behavior
- maintenance request service rules
- role-based middleware behavior
- tenant request UI behavior
- manager/admin queue behavior
- delete modal behavior
- frontend API redirect/error handling

Run everything with:

```bash
npm run verify:commit
```

## Production Notes

Recommended deployment shape for this monorepo:

- `apps/frontend` -> Netlify or Vercel
- `apps/backend` -> Render
- database -> MongoDB Atlas

Before deployment:

1. Set production env vars for both apps.
2. Point `VITE_API_URL` at the deployed backend `/api` origin.
3. Set backend CORS to the deployed frontend URL.
4. Verify Atlas network access and credentials.
5. Run `npm run verify:commit`.
- ✅ Property management interface

### Monorepo Features

- ✅ Nx workspace with intelligent build system
- ✅ Shared TypeScript configurations
- ✅ Shared cross-app library in `libs/shared`
- ✅ Unified linting and testing setup
- ✅ Dependency graph visualization
- ✅ Affected project detection for CI/CD optimization

## Development Guidelines

### Code Quality Tools

This project includes development tools for a great developer experience:

- **Prettier**: Automatic code formatting on save
- **VS Code Settings**: Pre-configured for optimal development
- **Format on Save**: Automatically formats code when you save files
- **ESLint**: Basic Nx configuration

### Recommended VS Code Extensions

The project includes recommended extensions that will be suggested when you open the workspace:

- Prettier - Code formatter
- ESLint - Linting support
- Tailwind CSS IntelliSense
- TypeScript support
- Nx Console for monorepo management

### Backend Guidelines

- Use TypeScript strict mode
- Follow RESTful API conventions
- Implement proper error handling
- Use Zod for input validation
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Frontend Guidelines

- Use TypeScript for all components
- Follow React best practices and hooks
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Handle loading and error states
- Use semantic HTML elements

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/doorloop_assessment
JWT_SECRET=your-super-secret-jwt-key-for-assessment
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml if needed
2. **MongoDB connection**: Ensure MongoDB is running and accessible
3. **Dependencies**: Run `make clean && make install` to refresh dependencies
4. **Environment**: Check .env files are properly configured

### Useful Commands

```bash
# View Docker logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Clean everything and start fresh
make clean
make docker-build
make docker-up
make seed
```

## License

This project is licensed under the ISC License.
