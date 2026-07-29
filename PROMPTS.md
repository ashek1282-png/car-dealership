# AI Tooling Chat History & Architecture Planning

## Phase 0: Architecture & Initialization

**User Prompt:**
> I am building a Car Dealership Inventory System for a TDD assignment. I've decided to use TypeScript, Node.js (Express), PostgreSQL (Prisma), and React. Before I start coding, I want to nail down the architecture. How should I structure the backend to strictly follow SOLID principles, keep controllers thin, and make unit testing with Vitest as easy as possible?

**AI Response Summary:**
The AI suggested a feature-based modular architecture separating Routes, Controllers, Services, and Repositories. It recommended keeping all business logic in the Service layer and keeping the Repository layer strictly for database interactions. This formed the basis of the architectural decisions blueprint.

**User Prompt:**
> That structure perfectly aligns with my goals. Let's initialize the monorepo. Can you provide the `docker-compose.yml` configuration needed to set up a PostgreSQL 15 container securely, and help scaffold the `package.json` dependencies for Express, Prisma, and Vitest?

**AI Response Summary:**
The AI provided the boilerplate for the Docker container, environment variables, and initial Prisma schema. It also provided the terminal commands to scaffold the backend and frontend directories. We then iteratively tweaked the setup to accommodate Tailwind CSS v4 and extract the Prisma configurations for a cleaner workspace.

## Phase 1: TDD - User Registration & Debugging

**User Prompt:**
> I wrote my first failing test for user registration. It correctly failed with a 404 at first, but after I implemented the controller and service, the test failed with a 500 status. The terminal threw this Prisma error: `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`. Why is my database not connecting during `npm test`?

**AI Response Summary:**
The AI explained that this specific Prisma error occurs when the `DATABASE_URL` connection string is missing or not properly loaded in the testing environment, meaning the database password evaluates to undefined. It helped me fix the issue by creating a specific `.env` file in the `backend/` directory with the full `DATABASE_URL` and adding `import 'dotenv/config';` to the top of my `app.ts` file so Vitest could load the variables.

**User Prompt:**
> I wrote the login controller and service, but my Supertest for valid login is failing with a `401 Unauthorized` instead of `200`. The register test right above it passes, so the user should exist. What could be the issue?

**AI Response Summary:**
The AI explained that a 401 means the code successfully reached the service layer but explicitly threw the `INVALID_CREDENTIALS` error. It suggested adding targeted console logs to trace the exact failure point: checking whether `prisma.user.findUnique` was failing to find the user in the database, or if `bcrypt.compare` was rejecting the password hash. This debugging strategy helped me isolate the root cause and fix the test state.

**User Prompt:**
> My authentication middleware is throwing a TypeScript error on `jwt.verify()` saying the returned type doesn't sufficiently overlap with my custom `{ id: string; role: string }` interface. Later, when creating the vehicle service, I got another error because Zod's `.optional()` evaluates to `string | undefined`, but Prisma expects `string | null` for nullable fields. How do I fix these?

**AI Response Summary:**
The AI explained that `@types/jsonwebtoken` returns a union type that needs to be cast to `unknown` before casting to a custom interface to satisfy strict mode. For the Prisma/Zod clash, it advised mapping the `undefined` values to `null` in the service layer using the nullish coalescing operator (`??`) before passing the data to the repository. This satisfied `exactOptionalPropertyTypes: true` in my `tsconfig.json`.

**User Prompt:**
> When using `createVehicleSchema.partial()` for my update schema, TypeScript threw an `exactOptionalPropertyTypes` error because Prisma won't accept `undefined` for fields. Then, in the controller, it threw an error saying `req.params.id` might be `string | string[] | undefined`. How do I resolve these?

**AI Response Summary:**
The AI explained that while Prisma safely ignores `undefined` values at runtime, strict mode flags it during compilation. To fix the service layer, it suggested typing the validated update payload as `any` (or `Prisma.VehicleUpdateInput`) to bypass the strict check while manually mapping `undefined` to `null` for specific fields. For the controller, it advised explicitly casting `req.params.id as string` since Express guarantees path parameters are strings, satisfying the compiler.
