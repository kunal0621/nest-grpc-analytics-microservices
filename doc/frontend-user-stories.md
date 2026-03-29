# Frontend User Stories

These stories cover the v1 Next.js frontend for both admin and customer roles. Authentication is intentionally out of scope for this milestone, so role separation is based on route structure and navigation only.

## Admin Stories

### Customer Management

**US-FA-1**  
As an admin, I want to browse customers in a paginated list so that I can manage records efficiently.

Acceptance criteria:

- The UI loads customers from `GET /customers`.
- The UI supports the existing `limit` and `cursor` inputs.
- The UI shows loading, empty, and error states.

**US-FA-2**  
As an admin, I want to create a customer so that a new user can be onboarded.

Acceptance criteria:

- The form captures `username`, `name`, `address`, `birthdate`, and `email`.
- Client validation prevents invalid submissions.
- Successful creation returns the admin to the customer detail experience or list with success feedback.

Dependency:

- `POST /customers`

**US-FA-3**  
As an admin, I want to edit a customer so that profile information stays current.

Acceptance criteria:

- The detail page loads the existing customer by `username`.
- The edit form updates `name`, `address`, `birthdate`, and `email`.
- `tier_and_details` is visible but read-only in v1.

Dependencies:

- `GET /customers/:username`
- `PUT /customers/:username`

**US-FA-4**  
As an admin, I want to link and unlink accounts from a customer so that the customer profile reflects the right trading accounts.

Acceptance criteria:

- The page lists linked account ids from the customer record.
- Admins can add an account by id.
- Admins can remove a linked account by id.
- The list refreshes after either action.

Dependencies:

- `POST /customers/:username/accounts`
- `DELETE /customers/:username/accounts/:account_id`

### Account Management

**US-FA-5**  
As an admin, I want to browse accounts using the existing limit filter so that I can quickly inspect a subset of accounts.

Acceptance criteria:

- The accounts page loads from `GET /accounts`.
- The filter uses the existing max-limit behavior only.
- The table shows account id, limit, and products.

**US-FA-6**  
As an admin, I want to create a new account with products and a trading limit so that it can be linked to a customer.

Acceptance criteria:

- The form captures `account_id`, `limit`, and one or more `products`.
- Invalid account ids, limits, and empty product arrays are blocked client-side.
- Successful creation shows the new account details.

Dependency:

- `POST /accounts`

**US-FA-7**  
As an admin, I want to update an account limit and its allowed products so that I can manage exposure and permissions.

Acceptance criteria:

- The detail page loads one account by id.
- The admin can update the trading limit.
- The admin can add a product.
- The admin can remove a product.

Dependencies:

- `GET /accounts/:account_id`
- `PATCH /accounts/:account_id/limit`
- `POST /accounts/:account_id/products`
- `DELETE /accounts/:account_id/products/:product`

### Transaction Workspace

**US-FA-8**  
As an admin, I want to inspect transactions for an account so that I can review trading activity.

Acceptance criteria:

- The page requires an `account_id` search input.
- Optional `start_date` and `end_date` filters are supported.
- Results display bucketed or flattened history in a readable table.
- The page can also show the transaction bucket summary.

Dependencies:

- `GET /transactions/account/:account_id`
- `GET /transactions/account/:account_id/summary`

**US-FA-9**  
As an admin, I want to filter a single account by symbol so that I can inspect symbol-specific activity.

Acceptance criteria:

- Symbol filtering is optional after an account is selected.
- The UI calls the symbol endpoint when a symbol filter is applied.
- The page clearly differentiates between no matches and request failure.

Dependency:

- `GET /transactions/account/:account_id/symbol/:symbol`

**US-FA-10**  
As an admin, I want to record a transaction so that new trading activity is captured.

Acceptance criteria:

- The form captures `account_id`, `symbol`, `amount`, `price`, and `transaction_code`.
- Only `buy` and `sell` are accepted for `transaction_code`.
- Success feedback confirms the transaction was recorded.

Dependency:

- `POST /transactions`

## Customer Stories

**US-FC-1**  
As a customer, I want to open my overview page so that I can see my profile, linked accounts, and recent activity in one place.

Acceptance criteria:

- The page loads from `GET /customers/:username/overview`.
- The page shows profile data, read-only tier details, linked accounts, and the latest five transactions per account.
- If one account’s recent transactions are unavailable, the rest of the overview still renders.

Dependency:

- `GET /customers/:username/overview`

**US-FC-2**  
As a customer, I want to open one account detail page so that I can review the account limit, enabled products, and transaction history.

Acceptance criteria:

- The page loads the selected account by id.
- The page shows account summary information.
- The page shows transaction bucket summary information.
- The page shows historical transactions for the selected account.

Dependencies:

- `GET /accounts/:account_id`
- `GET /transactions/account/:account_id`
- `GET /transactions/account/:account_id/summary`

**US-FC-3**  
As a customer, I want to filter account history by date range so that I can focus on a specific period.

Acceptance criteria:

- Start and end date inputs are optional.
- The UI refreshes the account history with the selected filters.
- Empty results are shown clearly without breaking the page.

Dependency:

- `GET /transactions/account/:account_id`

## Backend Support Stories

**US-FB-1**  
As a frontend application, I want CORS to be enabled from environment configuration so that the separate Next.js repo can call the gateway safely in local and deployed environments.

Acceptance criteria:

- The gateway reads `CORS_ALLOWED_ORIGINS`.
- Multiple origins can be supplied as a comma-separated list.
- When the variable is present, the configured origins are passed to CORS enablement.

**US-FB-2**  
As the customer overview page, I want a single backend overview endpoint so that I do not need to orchestrate customer, account, and recent transaction calls in the browser.

Acceptance criteria:

- The endpoint returns `customer`, `accounts`, and `recentTransactionsByAccount`.
- Linked accounts are resolved from the customer’s `accounts` array.
- Transactions are flattened, sorted newest-first, and trimmed to five per account.
- Missing customer or missing linked account returns an error.
- A transaction lookup failure for one account does not fail the entire overview response.

Dependency:

- `GET /customers/:username/overview`

## Out Of Scope For V1

- Login, logout, sessions, and role-based authorization
- Tier editing
- Symbol exposure analytics and net-position calculations
- Realtime updates or live market data
- Cross-account customer analytics beyond the overview page
