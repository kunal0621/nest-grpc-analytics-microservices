# Frontend Implementation Tasks

This document tracks the implementation work for a separate Next.js frontend repo named `analytics-frontend`. The current repo remains the backend workspace and only carries the backend support tasks needed by the frontend.

## Milestone 1: Project Bootstrap

- [ ] Create a new Next.js 15 app with App Router, TypeScript, and npm in a separate `analytics-frontend` repository.
- [ ] Add Tailwind CSS and `shadcn/ui` for the shared design system primitives.
- [ ] Add TanStack Query for API requests, caching, retries, and loading state management.
- [ ] Add React Hook Form and Zod for form state and validation.
- [ ] Define the frontend env contract:
  - `ANALYTICS_API_BASE_URL`
- [ ] Create a base app shell with:
  - role entry page
  - shared header
  - section navigation
  - toast/feedback area
  - empty, loading, and error state components

## Milestone 2: Shared Frontend Foundation

- [ ] Create a typed API client for the gateway REST endpoints.
- [ ] Add shared types for:
  - `CustomerOverviewResponse`
  - `CustomerSummary`
  - `AccountSummary`
  - `RecentTransaction`
- [ ] Create reusable UI building blocks:
  - page header
  - stat card
  - details panel
  - data table
  - filter bar
  - confirmation dialog
  - form field wrappers
- [ ] Standardize date, currency, and transaction code formatting helpers.
- [ ] Establish route-level loading and error boundaries.

## Milestone 3: Admin Experience

### Customers

- [ ] Build `/admin/customers` with cursor-based list loading against `GET /customers`.
- [ ] Add customer search-by-username navigation using `GET /customers/:username`.
- [ ] Build `/admin/customers/new` using `POST /customers`.
- [ ] Build `/admin/customers/[username]` with:
  - profile details
  - read-only tier display
  - linked accounts list
  - add account form using `POST /customers/:username/accounts`
  - remove account action using `DELETE /customers/:username/accounts/:account_id`
  - customer edit form using `PUT /customers/:username`

### Accounts

- [ ] Build `/admin/accounts` using `GET /accounts` with the existing max-limit filter only.
- [ ] Build `/admin/accounts/new` using `POST /accounts`.
- [ ] Build `/admin/accounts/[accountId]` with:
  - account summary
  - update limit form using `PATCH /accounts/:account_id/limit`
  - add product form using `POST /accounts/:account_id/products`
  - remove product action using `DELETE /accounts/:account_id/products/:product`

### Transactions

- [ ] Build `/admin/transactions` as an account-centric workspace.
- [ ] Add a search form requiring `account_id`.
- [ ] Add optional date range filters using `GET /transactions/account/:account_id`.
- [ ] Add optional symbol drill-down using `GET /transactions/account/:account_id/symbol/:symbol`.
- [ ] Add bucket summary display using `GET /transactions/account/:account_id/summary`.
- [ ] Add transaction recording form using `POST /transactions`.

## Milestone 4: Customer Experience

- [ ] Build `/customer/[username]` using `GET /customers/:username/overview`.
- [ ] Show:
  - customer profile
  - linked account cards
  - read-only tier details
  - latest five transactions per account
- [ ] Build `/customer/[username]/accounts/[accountId]` using:
  - `GET /accounts/:account_id`
  - `GET /transactions/account/:account_id`
  - `GET /transactions/account/:account_id/summary`
- [ ] Add account transaction filters by date range.
- [ ] Add customer-safe empty states for:
  - no linked accounts
  - no transactions in selected date range
  - unavailable recent transactions for a specific account

## Milestone 5: Backend Support Work In This Repo

- [x] Enable CORS in the analytics gateway through `CORS_ALLOWED_ORIGINS`.
- [x] Add `GET /customers/:username/overview` that returns:
  - customer profile
  - resolved linked accounts
  - `recentTransactionsByAccount` keyed by account id
- [x] Flatten bucketed transaction responses in the gateway, sort descending by date, and trim to the latest five records per account.
- [x] Tolerate recent transaction lookup failures per account by returning an empty list for the affected account while preserving the rest of the overview response.
- [ ] Keep Swagger documentation aligned with any new gateway response contracts.

## Milestone 6: Testing

### Backend

- [x] Add unit tests for customer overview aggregation.
- [x] Add controller coverage for `GET /customers/:username/overview`.
- [x] Add config coverage showing CORS is enabled from env configuration.
- [x] Add error-path coverage for:
  - missing customer
  - missing linked account
  - partial transaction lookup failure

### Frontend

- [ ] Add unit tests for:
  - API client wrappers
  - Zod schemas
  - formatting helpers
- [ ] Add component tests for:
  - customer form
  - account form
  - transaction search/filter bar
  - overview cards
- [ ] Add end-to-end flows for:
  - create customer
  - create account
  - link account to customer
  - record transaction
  - view customer overview
  - filter account transactions by date

## Milestone 7: Delivery Readiness

- [ ] Add frontend README setup instructions in the separate repo.
- [ ] Document the local dev startup order:
  - backend services
  - gateway
  - frontend
- [ ] Confirm responsive layouts for desktop and tablet widths.
- [ ] Verify all screens provide useful loading, empty, validation, and error feedback.
