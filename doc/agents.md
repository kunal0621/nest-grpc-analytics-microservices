# Coding Guidelines for NestJS gRPC Microservices

## 1. Architecture & Core Technologies
- **Framework:** NestJS
- **Communication:**
  - **Internal:** gRPC for fast, strongly-typed microservice-to-microservice communication.
  - **External:** HTTP/REST exposed by the API Gateway (`analytics-gateway`).
- **Database:** MongoDB accessed via Mongoose.
- **Structure:** Monorepo architecture managed by the Nest CLI.

## 2. Project Structure
- `apps/analytics-gateway`: The main HTTP API Gateway.
- `apps/accounts`: Microservice for account-related logic and data.
- `apps/customers`: Microservice for customer-related logic and data.
- `apps/transactions`: Microservice for transaction-related logic and data.
- `proto/`: Directory containing all `.proto` files at the workspace root.
- `doc/`: Project documentation and guidelines.

## 3. Naming Conventions
- **Files and Directories:** Kebab-case (e.g., `account.controller.ts`, `auth.guard.ts`).
- **Classes, Interfaces, and Decorators:** PascalCase (e.g., `AccountController`, `CreateAccountDto`).
- **Functions, Methods, and Variables:** CamelCase (e.g., `createAccount()`, `userId`).
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`).
- **gRPC and Protobuf:**
  - Services: PascalCase (e.g., `AccountService`)
  - RPC Methods: PascalCase in `.proto` files (e.g., `CreateAccount`), mapped to camelCase or PascalCase depending on the `@GrpcMethod` generator strategy.
  - Messages: PascalCase (e.g., `AccountRequest`, `AccountResponse`)

## 4. gRPC Best Practices
- **Single Source of Truth:** Keep all `.proto` files in the root `proto` directory so all microservices point to the exact same definitions.
- **Versioning:** Use explicit package versioning (e.g., `package account.v1;`).
- **Error Handling:** Use generic gRPC status codes combined with details when sending errors across boundaries.

## 5. Mongoose Models
- **Separation:** Each microservice manages its own database connection and Mongoose schemas (Accounts, Customers, Transactions).
- **Service Layer:** Keep Mongoose operations within the `Service` classes. Do not leak MongoDB specific types (like `Document` or `ObjectId` if possible) to the `Controller` layer.

## 6. Testing
- **Unit Tests:** Write robust unit tests for all business logic inside services.
- **Integration Tests:** Test the MongoDB queries in a separate environment or using memory databases.
- **E2E Tests:** Write E2E tests for the API Gateway HTTP endpoints, using mocked gRPC clients.
