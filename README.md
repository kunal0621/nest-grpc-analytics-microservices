# NestJS gRPC Analytics Microservices

A modern, scalable microservices architecture built with NestJS, utilizing gRPC for fast inter-service communication and MongoDB as the datastore.

## 🚀 Architecture overview

This project implements an API Gateway (`analytics-gateway`) that exposes REST/HTTP endpoints to clients, and forwards computational tasks to dedicated downstream microservices using **gRPC**. 

The current active services are:
- **`analytics-gateway`**: The HTTP API Gateway and main entry point. Handles routing and API documentation via Swagger.
- **`accounts`**: Microservice managing account data and logic.
- **`customers`**: Microservice managing customer data and logic.
- **`transactions`**: Microservice handling transaction tracking and analysis.

Each service is independently scalable and manages its own connected MongoDB schema. Protocol Buffers (`.proto`) are located in the unified `./proto` root folder, acting as the Single Source of Truth for communication payloads.

For full architectural standards and details, please carefully read [`doc/agents.md`](./doc/agents.md).

## 🛠️ Requirements & Setup

- [Node.js](https://nodejs.org/en/) >= 20.x
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Configuration: A `.env` file should be placed at the root. You can create one quickly:
  ```bash
  cp .env.example .env
  ```
  *(Be sure to fill in all the database URLs and ports correctly).*

## 📦 Installation

```bash
$ npm install
```

## 🏗️ Running the application locally

You can run individual services explicitly to watch for changes during development:

```bash
# Gateway
$ npm run start:gateway

# Microservices
$ npm run start:accounts
$ npm run start:customers
$ npm run start:transactions
```

Alternately, to run the default underlying monorepo application simply, you can execute:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📚 API Documentation
When the `analytics-gateway` is running, visit the interactive Swagger UI at:
**[http://localhost:<PORT>/api-docs]** (Replace `<PORT>` with the Gateway's configured port).

## 📄 License
This architecture is purely illustrative / UNLICENSED.
