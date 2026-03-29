import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  CustomerGrpcService,
  GetCustomerRequest,
  GetCustomerResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  ListCustomersRequest,
  ListCustomersResponse,
  AddAccountToCustomerRequest,
  AddAccountToCustomerResponse,
  RemoveAccountFromCustomerRequest,
  RemoveAccountFromCustomerResponse,
} from './constants/grpc-client.constants';
import { CUSTOMERS_SERVICE } from '../health/constants/grpc-client.constants';
import { PingResponse } from '../health/constants/grpc-client.constants';
import { AccountService } from '../accounts/account.service';
import {
  type AccountDto,
  type GetAccountByIdResponse,
} from '../accounts/constants/grpc-client.constants';
import { TransactionService } from '../transactions/transaction.service';
import { type GetTransactionsByAccountResponse } from '../transactions/constants/grpc-client.constants';
import {
  type CustomerOverviewResponse,
  type RecentTransaction,
} from './types/customer-overview.types';

@Injectable()
export class CustomerService implements OnModuleInit {
  private readonly logger = new Logger(CustomerService.name);
  private customerGrpcService: CustomerGrpcService;

  constructor(
    @Inject(CUSTOMERS_SERVICE)
    private readonly customersClient: ClientGrpc,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  onModuleInit() {
    this.customerGrpcService =
      this.customersClient.getService<CustomerGrpcService>('CustomerService');
  }

  pingCustomers(): Observable<PingResponse> {
    return this.customerGrpcService.ping({});
  }

  getCustomer(data: GetCustomerRequest): Observable<GetCustomerResponse> {
    return this.customerGrpcService.getCustomer(data);
  }

  getCustomerOverview(username: string): Observable<CustomerOverviewResponse> {
    return this.getCustomer({ username }).pipe(
      catchError(() =>
        throwError(
          () => new NotFoundException(`Customer "${username}" was not found.`),
        ),
      ),
      switchMap((customer) =>
        this.getAccountsForCustomer(customer, username).pipe(
          switchMap((accounts) =>
            this.getRecentTransactionsByAccount(accounts).pipe(
              map((recentTransactionsByAccount) => ({
                customer,
                accounts,
                recentTransactionsByAccount,
              })),
            ),
          ),
        ),
      ),
    );
  }

  createCustomer(
    data: CreateCustomerRequest,
  ): Observable<CreateCustomerResponse> {
    return this.customerGrpcService.createCustomer(data);
  }

  updateCustomer(
    data: UpdateCustomerRequest,
  ): Observable<UpdateCustomerResponse> {
    return this.customerGrpcService.updateCustomer(data);
  }

  listCustomers(data: ListCustomersRequest): Observable<ListCustomersResponse> {
    return this.customerGrpcService.listCustomers(data);
  }

  addAccountToCustomer(
    data: AddAccountToCustomerRequest,
  ): Observable<AddAccountToCustomerResponse> {
    return this.customerGrpcService.addAccountToCustomer(data);
  }

  removeAccountFromCustomer(
    data: RemoveAccountFromCustomerRequest,
  ): Observable<RemoveAccountFromCustomerResponse> {
    return this.customerGrpcService.removeAccountFromCustomer(data);
  }

  private getAccountsForCustomer(
    customer: GetCustomerResponse,
    username: string,
  ): Observable<AccountDto[]> {
    if (customer.accounts.length === 0) {
      return of([]);
    }

    return forkJoin(
      customer.accounts.map((accountId) =>
        this.accountService.getAccountById(accountId).pipe(
          map((response: GetAccountByIdResponse) => response.account),
          catchError(() =>
            throwError(
              () =>
                new NotFoundException(
                  `Account "${accountId}" linked to customer "${username}" was not found.`,
                ),
            ),
          ),
        ),
      ),
    );
  }

  private getRecentTransactionsByAccount(
    accounts: AccountDto[],
  ): Observable<Record<string, RecentTransaction[]>> {
    if (accounts.length === 0) {
      return of({});
    }

    return forkJoin(
      accounts.map((account) =>
        this.transactionService
          .getTransactionsByAccount({ account_id: account.account_id })
          .pipe(
            map(
              (response) =>
                [
                  String(account.account_id),
                  this.extractRecentTransactions(response),
                ] as const,
            ),
            catchError((error: unknown) => {
              this.logger.warn(
                `Unable to fetch recent transactions for account "${account.account_id}". Returning an empty list instead.`,
                error instanceof Error ? error.stack : undefined,
              );

              return of([String(account.account_id), []] as const);
            }),
          ),
      ),
    ).pipe(
      map(
        (entries) =>
          Object.fromEntries(entries) as Record<string, RecentTransaction[]>,
      ),
    );
  }

  private extractRecentTransactions(
    response: GetTransactionsByAccountResponse,
  ): RecentTransaction[] {
    return response.buckets
      .flatMap((bucket) => bucket.transactions)
      .map((transaction) => ({
        date: this.normalizeDateValue(transaction.date),
        amount: transaction.amount,
        transaction_code: transaction.transaction_code,
        symbol: transaction.symbol,
        price: transaction.price,
        total: transaction.total,
      }))
      .sort(
        (left, right) =>
          new Date(right.date).getTime() - new Date(left.date).getTime(),
      )
      .slice(0, 5);
  }

  private normalizeDateValue(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : value;
  }
}
