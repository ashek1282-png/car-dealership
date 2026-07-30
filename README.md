# 🚗 AutoLedger - Car Dealership Inventory System

> A production-grade, full-stack car dealership management platform built with TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, and React 19 using Test-Driven Development (TDD) principles.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
  - [High-Level Architecture](#high-level-architecture)
  - [Backend Layered Architecture](#backend-layered-architecture)
  - [Authentication Sequence](#authentication-sequence)
  - [Database Schema (ERD)](#database-schema-erd)
- [Directory Structure](#directory-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Environment Setup](#2-environment-setup)
  - [3. Spin Up Infrastructure](#3-spin-up-infrastructure)
  - [4. Backend Installation & Database Setup](#4-backend-installation--database-setup)
  - [5. Frontend Installation](#5-frontend-installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [User Workflow](#user-workflow)
  - [Admin Workflow](#admin-workflow)
- [API Documentation](#api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Vehicle Management Endpoints](#vehicle-management-endpoints)
  - [Inventory Control Endpoints](#inventory-control-endpoints)
  - [Error Responses](#error-responses)
- [Development](#development)
  - [Development Commands](#development-commands)
  - [Code Formatting & Linting](#code-formatting--linting)
- [Testing](#testing)
  - [Test Suite Organization](#test-suite-organization)
  - [Running Tests](#running-tests)
  - [Test-Driven Development (TDD) Strategy](#test-driven-development-tdd-strategy)
- [Build & Deployment](#build--deployment)
  - [Production Build](#production-build)
  - [Docker Containerization](#docker-containerization)
- [Security](#security)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

**AutoLedger** is a full-stack Car Dealership Inventory System designed to streamline vehicle catalog management, stock monitoring, buyer operations, and administrative inventory control. 

### Why It Exists
Managing dealership inventory often suffers from inconsistent data handling, race conditions during stock updates, and poor separation of user permissions. AutoLedger resolves these issues by delivering a high-performance REST API backed by PostgreSQL and Prisma ORM, coupled with a responsive React 19 single-page application.

### Problem Solved
- **Stock Integrity:** Prevents overselling via atomic database transactions (`decrement`/`increment`) when purchasing or restocking vehicles.
- **Access Control:** Enforces strict Role-Based Access Control (RBAC) guaranteeing that administrative tasks (adding vehicles, modifying pricing, restocking) are strictly isolated from standard customer actions.
- **Scalable Architecture:** Implements clean feature-based modularity (Routes, Controllers, Services, Repositories) following SOLID design principles to ensure high maintainability and testability.

### Target Audience
- **Dealership Managers & Inventory Clerks:** Who require real-time visibility into vehicle stock, category distributions, pricing updates, and restock capabilities.
- **Car Buyers:** Who need to filter, search, view detailed specs, and purchase vehicles seamlessly.
- **Software Engineers:** Looking for a reference implementation of a monorepo built with TDD, strict TypeScript configurations, and modern web software design patterns.

---

## Key Features

- 🔐 **Secure Role-Based Authentication:** JWT-driven authentication with bcrypt password hashing separating standard `USER` and administrative `ADMIN` accounts.
- 🚘 **Comprehensive Vehicle Catalog:** Full CRUD operations for vehicle records including make, model, year, category, price, stock quantity, descriptions, and imagery.
- 🔍 **Advanced Inventory Search & Filtering:** Case-insensitive parameter searches across vehicle make, model, category, and minimum/maximum price bounds.
- 📦 **Atomic Inventory Operations:** Purchase and restock endpoints leveraging Prisma database update operations to guarantee zero race conditions.
- 📊 **Real-Time Inventory Analytics:** Frontend dashboard delivering quick stat cards (Total Fleet, Low Stock Warnings, Total Valuation, Out of Stock Alerts).
- 🛡️ **Robust Validation & Error Handling:** Centralized schema validation powered by Zod and unified Express error handling middleware.
- 🧪 **Test-Driven Design (TDD):** End-to-end endpoint verification with Vitest and Supertest testing all API routes, edge cases, and RBAC rules.
- ⚡ **Modern React 19 Frontend:** Single-Page Application (SPA) powered by Vite, TanStack React Query v5 for server-state caching, Tailwind CSS v4, and dynamic Lucide React iconography.

---

## Screenshots / Architecture

> *Placeholder: Insert application screenshots below.*
> 
> `docs/screenshots/dashboard.png` — *Main Vehicle Catalog & Search Dashboard*
> `docs/screenshots/admin-panel.png` — *Admin Inventory Management & Restock Modal*

---

## Architecture

### High-Level Architecture

AutoLedger adopts a monorepo structure separating the client-side single-page application (`/frontend`) from the stateless REST API server (`/backend`).

```mermaid
graph TD
    Client["React 19 Frontend (Vite + TanStack Query)"]
    API["Express 5 REST API (Node.js + TS)"]
    DB[(PostgreSQL 15 Database)]

    Client -->|HTTP / REST JSON + Bearer JWT| API
    API -->|Prisma Client / pg Driver Adapter| DB
```

---

### Backend Layered Architecture

The backend strictly enforces the **Repository Pattern** and **Service Layer Pattern** across independent feature modules (`auth`, `vehicle`, `inventory`). Controllers remain thin and focused exclusively on request parsing and response formatting.

```mermaid
flowchart TD
    subgraph Client Layer
        Req[HTTP Request]
    end

    subgraph Express Routing & Middleware
        Router[Module Router]
        AuthMW[Auth Middleware - JWT Verify]
        AdminMW[Admin Guard Middleware]
    end

    subgraph Feature Module
        Ctrl[Controller Layer - Zod Validation]
        Svc[Service Layer - Business Logic]
        Repo[Repository Layer - Data Access]
    end

    subgraph Infrastructure
        Prisma[Prisma Client v7]
        PG[(PostgreSQL 15 Database)]
    end

    Req --> Router
    Router --> AuthMW
    AuthMW --> AdminMW
    AdminMW --> Ctrl
    Ctrl --> Svc
    Svc --> Repo
    Repo --> Prisma
    Prisma --> PG
```

---

### Authentication Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Client / User
    participant Router as Auth Router
    participant Ctrl as Auth Controller
    participant Svc as Auth Service
    participant Repo as Auth Repository
    participant DB as PostgreSQL DB

    User->>Router: POST /api/auth/login {email, password}
    Router->>Ctrl: Forward request
    Ctrl->>Ctrl: Validate payload via loginSchema (Zod)
    Ctrl->>Svc: Call loginUser(validatedData)
    Svc->>Repo: findUserByEmail(email)
    Repo->>DB: Query User record
    DB-->>Repo: Return User entity
    Repo-->>Svc: Return User
    Svc->>Svc: bcrypt.compare(password, user.password)
    Svc->>Svc: jwt.sign({id, role}, JWT_SECRET)
    Svc-->>Ctrl: Return { token, userWithoutPassword }
    Ctrl-->>User: HTTP 200 OK + JWT Token & User Profile
```

---

### Database Schema (ERD)

```mermaid
erDiagram
    USER {
        string id PK "UUID"
        string name
        string email UK
        string password "Hashed with bcrypt"
        Role role "USER | ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    VEHICLE {
        string id PK "UUID"
        string make
        string model
        int year
        string category
        string description "Nullable"
        float price
        int quantity "Default 0"
        string imageUrl "Nullable"
        datetime createdAt
        datetime updatedAt
    }
```

---

## Directory Structure

```text
car-dealership/
├── .env                  # Root environment config for Docker Compose
├── .gitignore            # Root Git ignore rules
├── docker-compose.yml    # PostgreSQL 15 container definition
├── PROMPTS.md            # Architecture decision history & TDD prompt logs
├── README.md             # Project documentation
├── backend/
│   ├── .env              # Backend runtime environment variables
│   ├── package.json      # Backend scripts, runtime & dev dependencies
│   ├── prisma.config.ts  # Prisma CLI configuration
│   ├── tsconfig.json     # Strict TypeScript compiler options
│   ├── vitest.config.ts  # Vitest unit & integration test configuration
│   ├── prisma/
│   │   ├── migrations/   # Managed SQL migration history
│   │   ├── schema.prisma # Prisma data models & PostgreSQL configuration
│   │   └── seed.ts       # Database seeder execution entry point
│   └── src/
│       ├── app.ts        # Express app initialization, CORS & route registry
│       ├── server.ts     # HTTP server launcher with automatic DB seeder
│       ├── generated/    # Prisma Client output directory
│       ├── modules/
│       │   ├── auth/     # Authentication routes, controllers, services, repos, schemas, tests
│       │   ├── inventory/# Stock modification & purchase feature module
│       │   └── vehicle/  # Vehicle CRUD & search feature module
│       └── shared/
│           ├── middleware/ # Auth verification, RBAC guards, global error handler
│           ├── prisma/     # Prisma Client singleton initialized with pg driver adapter
│           ├── seed/       # Default seed accounts & vehicle inventory dataset
│           └── utils/      # Async error boundary wrapper (catchAsync)
└── frontend/
    ├── .env.example      # Example environment file for Vite frontend
    ├── index.html        # HTML document template
    ├── package.json      # Frontend UI dependencies & scripts
    ├── vite.config.ts    # Vite bundler configuration (React + Tailwind CSS v4)
    ├── public/           # Static web assets
    └── src/
        ├── App.tsx       # Main routing tree & layout wrapper
        ├── main.tsx      # Application root mounting with global providers
        ├── components/
        │   ├── layout/   # AppLayout, Topbar, Sidebar, ProtectedRoute, AdminRoute
        │   ├── ui/       # Modal components, Toast notifications, badges
        │   └── vehicles/ # InventoryStats, VehicleCard, VehicleFilters, RestockModal, VehicleFormModal
        ├── context/      # AuthContext (JWT management), ToastContext
        ├── hooks/        # Custom React hooks (useAuth, useVehicles, useToast)
        ├── pages/        # DashboardPage, VehicleDetailsPage, AdminPage, LoginPage, RegisterPage
        ├── services/     # Axios client configuration & API service modules
        ├── types/        # TypeScript interfaces & domain types
        └── utils/        # Frontend utility functions
```

---

## Tech Stack

### Languages
- **TypeScript** (`~5.7 / ~7.0`): Strict mode enabled across backend and frontend (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **HTML5 & CSS3**: Modern standard compliance.

### Frameworks & Libraries
- **Backend:** Express (`^5.2.1`), Zod (`^4.4.3`), jsonwebtoken (`^9.0.3`), bcrypt (`^6.0.0`), cors (`^2.8.6`).
- **Frontend:** React (`^19.2.7`), React Router DOM (`^7.18.2`), TanStack React Query (`^5.101.4`), Axios (`^1.18.1`), Lucide React (`^1.27.0`), Tailwind CSS (`^4.3.3`).

### Runtime & Database
- **Node.js**: ES Modules (`"type": "module"`).
- **PostgreSQL**: Version 15 (Alpine Linux).
- **ORM:** Prisma ORM (`^7.9.1`) with `@prisma/adapter-pg`.

### Dev Tools & Testing
- **Testing:** Vitest (`^4.1.10`), Supertest (`^7.2.2`).
- **Execution / Build:** `tsx` (`^4.23.1`), `tsc` (TypeScript Compiler), Vite (`^8.1.1`).
- **Linters & Formatters:** Prettier (`^3.9.6`), Oxlint (`^1.71.0`).
- **Infrastructure:** Docker & Docker Compose.

---

## Installation

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Docker Desktop** (or PostgreSQL `v15` installed locally)

---

### 1. Clone Repository

```bash
git clone https://github.com/your-username/car-dealership.git
cd car-dealership
```

---

### 2. Environment Setup

Create `.env` files in both the project root and the `/backend` directory.

#### Root Environment (`.env`)
```env
POSTGRES_USER=car_admin
POSTGRES_PASSWORD=car_admin_password
POSTGRES_DB=car_dealership
POSTGRES_PORT=5432
```

#### Backend Environment (`backend/.env`)
```env
PORT=3000
DATABASE_URL="postgresql://car_admin:car_admin_password@localhost:5432/car_dealership?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

#### Frontend Environment (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

---

### 3. Spin Up Infrastructure

Start the PostgreSQL database container using Docker Compose:

```bash
docker-compose up -d
```

---

### 4. Backend Installation & Database Setup

Navigate to the `backend` folder, install dependencies, run migrations, and generate Prisma artifacts:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

### 5. Frontend Installation

Navigate to the `frontend` folder and install client-side dependencies:

```bash
cd ../frontend
npm install
```

---

## Quick Start

Run both backend and frontend servers simultaneously for local development.

### Terminal 1: Backend API Server
```bash
cd backend
npm run dev
```
*The API will start at `http://localhost:3000` and automatically seed initial data if missing.*

### Terminal 2: Frontend Web App
```bash
cd frontend
npm run dev
```
*The React application will be accessible at `http://localhost:5173`.*

---

## Configuration

### Environment Variables

| Variable | Location | Required | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POSTGRES_USER` | `/.env` | Yes | `car_admin` | PostgreSQL container username |
| `POSTGRES_PASSWORD` | `/.env` | Yes | `car_admin_password` | PostgreSQL container password |
| `POSTGRES_DB` | `/.env` | Yes | `car_dealership` | PostgreSQL container database name |
| `POSTGRES_PORT` | `/.env` | Yes | `5432` | Exposed PostgreSQL host port |
| `PORT` | `/backend/.env` | No | `3000` | HTTP port for the Express backend API |
| `DATABASE_URL` | `/backend/.env` | Yes | `postgresql://...` | PostgreSQL connection URI for Prisma ORM |
| `JWT_SECRET` | `/backend/.env` | Yes | `vEtL=%6n6Z...` | Secret key used to sign and verify JWT tokens |
| `VITE_API_URL` | `/frontend/.env`| No | `http://localhost:3000/api` | Base URL for backend API calls from Vite |

---

## Usage

### Demo Accounts

The database seed script automatically provisions two initial accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@autoledger.com` | `Admin@123` | Full Access (Create, Read, Update, Delete, Restock) |
| 👤 **User** | `user@autoledger.com` | `User@123` | Standard Access (Browse, Filter, View Details, Purchase) |

---

### User Workflow
1. Navigate to `http://localhost:5173/login`.
2. Log in using `user@autoledger.com` / `User@123`.
3. Explore the **Dashboard Catalog**, filter vehicles by Category, Make, Model, or Price Range.
4. Click on a vehicle card to view details and execute a **Purchase**.

### Admin Workflow
1. Log in using `admin@autoledger.com` / `Admin@123`.
2. Access the **Admin Panel** (`/admin`) via the sidebar navigation.
3. Add new vehicles to the fleet via the vehicle creation modal.
4. Adjust pricing, modify vehicle specifications, or click **Restock** to increment stock levels.

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
**Response (`201 Created`):**
```json
{
  "id": "a6b8c9d0-1234-5678-90ab-cdef12345678",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "USER",
  "createdAt": "2026-07-30T16:00:00.000Z",
  "updatedAt": "2026-07-30T16:00:00.000Z"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@autoledger.com",
  "password": "Admin@123"
}
```
**Response (`200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "e2f1a3b4-5678-90ab-cdef-1234567890ab",
    "name": "Dana Admin",
    "email": "admin@autoledger.com",
    "role": "ADMIN"
  }
}
```

---

### Vehicle Management Endpoints

> *Note: Authorization requires header `Authorization: Bearer <JWT_TOKEN>`.*

#### List All Vehicles
```http
GET /api/vehicles
Authorization: Bearer <TOKEN>
```

#### Search & Filter Vehicles
```http
GET /api/vehicles/search?make=Toyota&minPrice=20000&maxPrice=50000
Authorization: Bearer <TOKEN>
```

#### Create Vehicle (Admin Only)
```http
POST /api/vehicles
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "make": "Tesla",
  "model": "Model 3",
  "year": 2024,
  "category": "Electric",
  "price": 38990,
  "quantity": 4,
  "description": "Long Range All-Wheel Drive",
  "imageUrl": "https://images.unsplash.com/photo-1560958089-b8a1929cea89"
}
```

#### Update Vehicle (Admin Only)
```http
PUT /api/vehicles/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "price": 36990,
  "quantity": 6
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /api/vehicles/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

### Inventory Control Endpoints

#### Purchase Vehicle (User / Admin)
```http
POST /api/inventory/:id/purchase
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "quantity": 1
}
```
**Response (`200 OK`):** Returns the updated vehicle record with decremented stock.

#### Restock Vehicle (Admin Only)
```http
POST /api/inventory/:id/restock
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "quantity": 5
}
```
**Response (`200 OK`):** Returns the updated vehicle record with incremented stock.

---

### Error Responses

The API returns standardized JSON error formats:

#### Validation Error (`400 Bad Request`)
```json
{
  "errors": "[{\"code\":\"invalid_type\",\"expected\":\"string\",\"path\":[\"make\"],\"message\":\"Make is required\"}]"
}
```

#### Authorization Error (`403 Forbidden`)
```json
{
  "error": "Forbidden: Admin access required"
}
```

---

## Development

### Development Commands

| Command | Workspace | Description |
| :--- | :--- | :--- |
| `npm run dev` | Backend | Starts `tsx` watch server for hot-reloading backend changes |
| `npm run dev` | Frontend | Boots Vite development server |
| `npm run build` | Backend | Compiles TypeScript into `/dist` directory via `tsc` |
| `npm run build` | Frontend | Builds production static assets into `/dist` via `vite build` |
| `npm run start` | Backend | Runs compiled production code (`node dist/server.js`) |
| `npm run prisma:generate` | Backend | Re-generates Prisma Client types |
| `npm run prisma:migrate` | Backend | Applies Prisma migrations to PostgreSQL |
| `npm run prisma:seed` | Backend | Populates seed users & vehicles |

### Code Formatting & Linting

```bash
# Format backend codebase
cd backend && npm run format

# Format frontend codebase
cd frontend && npm run format

# Run Oxlint on frontend
cd frontend && npm run lint
```

---

## Testing

### Test Suite Organization

The backend test suite is constructed with **Vitest** and **Supertest**, directly covering every API module:

- `src/modules/auth/auth.test.ts`: Covers registration validation, user creation, password verification, and JWT generation.
- `src/modules/vehicle/vehicle.test.ts`: Verifies CRUD operations, search filtering, and admin role enforcement.
- `src/modules/inventory/inventory.test.ts`: Verifies restock incrementation, purchase stock decrement, out-of-stock boundaries, and 404/401 edge cases.

### Running Tests

Ensure PostgreSQL is running, then execute:

```bash
cd backend
npm test
```

To execute tests once without watch mode:

```bash
cd backend
npx vitest run
```

### Test-Driven Development (TDD) Strategy
Every feature in AutoLedger was implemented following Red-Green-Refactor methodology:
1. **Red:** Write an integration test using Supertest specifying the expected endpoint route, request body, headers, and status code.
2. **Green:** Write the minimum route, controller, service, and repository code necessary to satisfy the test requirements.
3. **Refactor:** Clean up TypeScript types, enforce Zod validation schemas, and extract shared error handling.

---

## Build & Deployment

### Production Build

#### 1. Build Backend
```bash
cd backend
npm run build
```
*Outputs compiled JavaScript code to `backend/dist`.*

#### 2. Build Frontend
```bash
cd frontend
npm run build
```
*Outputs optimized client bundles to `frontend/dist`.*

---

### Docker Containerization

To run the full stack in a containerized environment, expand `docker-compose.yml` or containerize individual microservices:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    container_name: car_dealership_db
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Security

- 🔒 **Password Hashing:** Hashes user credentials using `bcrypt` with a salt factor of 10 prior to storage.
- 🔑 **Stateless JWT Tokens:** Issues short-lived JSON Web Tokens signed with secret keys stored strictly in server-side environment variables.
- 🚫 **Parameter Sanitization:** Zod schemas strictly validate incoming request body parameters and query strings to prevent SQL or injection attacks.
- 🔐 **Role-Based Guards:** Express middleware (`requireAdmin`) intercepts administrative endpoints to verify the token bearer holds the `ADMIN` role.
- 🛡️ **CORS Enabled:** Cross-Origin Resource Sharing is configured to restrict unauthorized frontend origins.

---

## Performance

- ⚡ **Database Driver Adapter:** Utilizes `@prisma/adapter-pg` alongside `pg` connection pool driver adapters for high-throughput queries.
- 🚀 **Atomic Operations:** Utilizes native database-level atomic operations (`increment` / `decrement`) for inventory management rather than vulnerable fetch-then-write code patterns.
- 📦 **Vite Bundling:** Frontend assets are tree-shaken and code-split for fast loading.
- 🔄 **TanStack React Query Caching:** Eliminates redundant network requests on the frontend through client-side query caching and automatic revalidation.

---

## Troubleshooting

| Problem / Issue | Cause | Solution |
| :--- | :--- | :--- |
| `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` | Missing or invalid `DATABASE_URL` in `backend/.env` | Verify `.env` exists in `/backend` and contains a valid PostgreSQL connection string. |
| `P2002: Unique constraint failed on the fields: (email)` | Attempting to register an email address already stored in the database | Use a different email address or reset database rows. |
| `Unauthorized: No token provided` | Requesting protected endpoints without `Authorization` header | Include `Authorization: Bearer <YOUR_JWT_TOKEN>` in request headers. |
| `Forbidden: Admin access required` | Standard `USER` account attempting to call `/api/vehicles` (POST/PUT/DELETE) or `/restock` | Log in with an account having `ADMIN` role (`admin@autoledger.com`). |
| Database connection refused on port `5432` | PostgreSQL Docker container is stopped or port is blocked | Run `docker-compose up -d` and check status with `docker ps`. |

---

## FAQ

**Q: How do I make a user an Admin?**  
A: You can update the user's `role` directly in PostgreSQL or via Prisma Studio (`npx prisma studio`), setting the `role` enum field to `'ADMIN'`.

**Q: Does backend startup overwrite existing data?**  
A: No. The automated database seeder checks if seed accounts or vehicles exist before inserting. Existing records are preserved.

**Q: Can I run this without Docker?**  
A: Yes, provided you have a local PostgreSQL instance running and update `DATABASE_URL` in `backend/.env` accordingly.

---

## License

This project is licensed under the **ISC License**.

---

## Acknowledgements

- [Express.js](https://expressjs.com/) for backend application routing.
- [Prisma ORM](https://www.prisma.io/) for type-safe database queries.
- [React](https://react.dev/) & [Vite](https://vitejs.dev/) for modern frontend rendering.
- [Tailwind CSS](https://tailwindcss.com/) for responsive UI styling.
- [Vitest](https://vitest.dev/) for test runner performance.
