# Analytics Application - User Stories & API Design

Based on the structure of your MongoDB collections (`customers`, `accounts`, `transactions`), here is a comprehensive breakdown of user stories and the corresponding API endpoints you can build across your microservices.

## 1. Customers Microservice

**Collection:** `customers`
**Responsibilities:** Managing user profiles, personal information, and the mapping of which accounts belong to which customer.

### User Stories
* **US-C1:** As an administrator, I want to register a new customer with their personal details (name, email, address, birthdate) and assign an initial tier.
* **US-C2:** As a customer, I want to view my profile details to verify my information is up to date.
* **US-C3:** As an administrator, I want to fetch a customer by their email or username to provide user support.
* **US-C4:** As an administrator, I want to update a customer's address or tier details.
* **US-C5:** As a system process, I want to link a newly created `account_id` to an existing customer profile.
* **US-C6:** As a system process, I want to retrieve a list of `account_id`s associated with a specific customer to fetch downstream data.

### Proposed APIs (gRPC Methods -> Gateway REST/GraphQL)
* `CreateCustomer` (`POST /api/customers`)
* `GetCustomer` (`GET /api/customers/:id` or `GET /api/customers?username={username}`)
* `UpdateCustomer` (`PUT /api/customers/:id`)
* `ListCustomers` (`GET /api/customers` - optionally with pagination)
* `AddAccountToCustomer` (`POST /api/customers/:id/accounts`)
* `RemoveAccountFromCustomer` (`DELETE /api/customers/:id/accounts/:accountId`)

---

## 2. Accounts Microservice

**Collection:** `accounts`
**Responsibilities:** Managing financial accounts, their trading limits, and the allowed products (e.g., CurrencyService, Derivatives) assigned to them.

### User Stories
* **US-A1:** As an administrator, I want to create a new account with a predefined financial `limit` and an array of enabled `products`.
* **US-A2:** As a customer, I want to view my account details, including my limit and the products I am allowed to trade.
* **US-A3:** As a risk manager, I want to update an account's limit to manage financial exposure dynamically.
* **US-A4:** As an administrator, I want to add or remove permitted products (e.g., add "InvestmentStock") for a specific account.
* **US-A5:** As a system process, I want to verify if a specific account is authorized to trade a certain product before settling a transaction.

### Proposed APIs (gRPC Methods -> Gateway REST/GraphQL)
* `CreateAccount` (`POST /api/accounts`)
* `GetAccountById` (`GET /api/accounts/:accountId`)
* `UpdateAccountLimit` (`PATCH /api/accounts/:accountId/limit`)
* `AddProductToAccount` (`POST /api/accounts/:accountId/products`)
* `RemoveProductFromAccount` (`DELETE /api/accounts/:accountId/products/:productName`)

---

## 3. Transactions Microservice

**Collection:** `transactions` (Note: Uses the Bucket Pattern)
**Responsibilities:** Tracking and appending individual transactions (buy/sell) grouped into buckets by `account_id` and date range.

### User Stories
* **US-T1:** As a trading system, I want to record a new transaction (buy/sell) tied to an `account_id`, appending it to the current time bucket or creating a new bucket if necessary.
* **US-T2:** As a customer, I want to view my transaction history for a specific account so I can track my trading activity over time.
* **US-T3:** As a customer, I want to filter my transaction history within a specific date range (`bucket_start_date` to `bucket_end_date`).
* **US-T4:** As a customer or analyst, I want to search for all transactions involving a specific symbol (e.g., "ibm", "amzn").
* **US-T5:** As a reporting tool, I want to retrieve the high-level transaction summary block (total transaction count, dates) for an account without loading all nested transactions into memory.

### Proposed APIs (gRPC Methods -> Gateway REST/GraphQL)
* `RecordTransaction` (`POST /api/transactions`) - Requires `account_id`, `symbol`, `amount`, `price`, `transaction_code`. Appends to array.
* `GetTransactionsByAccount` (`GET /api/transactions/account/:accountId`) - Allow query params `?startDate=...&endDate=...`.
* `GetTransactionsBySymbol` (`GET /api/transactions/account/:accountId/symbol/:symbol`)
* `GetTransactionBucketSummary` (`GET /api/transactions/account/:accountId/summary`)

---

## 4. Analytics Gateway (Aggregator / BFF - Backend For Frontend)

**Responsibilities:** Acting as the entry point API, aggregating data across the three microservices to fulfill complex client-facing UI requirements.

### User Stories (Orchestration)
* **US-G1 (Customer Dashboard / Portfolio):** As a customer, I want to view a single dashboard showing my personal details, my linked accounts, their limits, and the most recent 5 transactions for each account.
  * **API Flow:** 
    1. Gateway calls `CustomerService.GetCustomer`.
    2. Gateway uses the returned `accounts` array to make parallel gRPC calls to `AccountService.GetAccountById`.
    3. Gateway makes parallel gRPC calls to `TransactionService.GetTransactionsByAccount` for each account ID, optionally with a standard limit.
* **US-G2 (Symbol Exposure / Aggregation):** As a risk manager, I want to query a specific customer and see their total transactional exposure to a specific symbol across all their accounts (e.g., calculating total buys vs. sells for "znga").
  * **API Flow:** 
    1. Gateway fetches customer's account IDs using `CustomerService`.
    2. Gateway queries `TransactionService.GetTransactionsBySymbol` for all those account IDs.
    3. Gateway calculates the net position and returns an aggregated overview.
