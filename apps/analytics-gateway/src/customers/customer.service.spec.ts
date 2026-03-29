/* eslint-disable @typescript-eslint/unbound-method */
import { Logger, NotFoundException } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AccountService } from '../accounts/account.service';
import { TransactionService } from '../transactions/transaction.service';
import { CustomerService } from './customer.service';

describe('CustomerService overview aggregation', () => {
  let service: CustomerService;
  let customerGrpcService: {
    ping: jest.Mock;
    getCustomer: jest.Mock;
    createCustomer: jest.Mock;
    updateCustomer: jest.Mock;
    listCustomers: jest.Mock;
    addAccountToCustomer: jest.Mock;
    removeAccountFromCustomer: jest.Mock;
  };
  let accountService: jest.Mocked<AccountService>;
  let transactionService: jest.Mocked<TransactionService>;
  let loggerWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    customerGrpcService = {
      ping: jest.fn(),
      getCustomer: jest.fn(),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      listCustomers: jest.fn(),
      addAccountToCustomer: jest.fn(),
      removeAccountFromCustomer: jest.fn(),
    };

    const customersClient = {
      getService: jest.fn().mockReturnValue(customerGrpcService),
    } as unknown as ClientGrpc;

    accountService = {
      pingAccounts: jest.fn(),
      getAccounts: jest.fn(),
      createAccount: jest.fn(),
      getAccountById: jest.fn(),
      updateAccountLimit: jest.fn(),
      addProductToAccount: jest.fn(),
      removeProductFromAccount: jest.fn(),
      onModuleInit: jest.fn(),
    } as unknown as jest.Mocked<AccountService>;

    transactionService = {
      pingTransactions: jest.fn(),
      recordTransaction: jest.fn(),
      getTransactionsByAccount: jest.fn(),
      getTransactionsBySymbol: jest.fn(),
      getTransactionBucketSummary: jest.fn(),
      onModuleInit: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    service = new CustomerService(
      customersClient,
      accountService,
      transactionService,
    );
    service.onModuleInit();
  });

  afterEach(() => {
    loggerWarnSpy.mockRestore();
  });

  it('builds a customer overview with accounts and the latest five transactions per account', async () => {
    customerGrpcService.getCustomer.mockReturnValue(
      of({
        username: 'john_doe',
        name: 'John Doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        accounts: [101],
        tier_and_details: {},
      }),
    );
    accountService.getAccountById.mockReturnValue(
      of({
        account: {
          account_id: 101,
          limit: 10000,
          products: ['InvestmentStock'],
        },
      }),
    );
    transactionService.getTransactionsByAccount.mockReturnValue(
      of({
        buckets: [
          {
            account_id: 101,
            transaction_count: 3,
            bucket_start_date: new Date('2024-01-01'),
            bucket_end_date: new Date('2024-01-31'),
            transactions: [
              {
                date: new Date('2024-01-01T08:00:00.000Z'),
                amount: 5,
                transaction_code: 'buy',
                symbol: 'AAPL',
                price: '100.00',
                total: '500.00',
              },
              {
                date: new Date('2024-01-03T08:00:00.000Z'),
                amount: 10,
                transaction_code: 'sell',
                symbol: 'MSFT',
                price: '120.00',
                total: '1200.00',
              },
            ],
          },
          {
            account_id: 101,
            transaction_count: 4,
            bucket_start_date: new Date('2024-02-01'),
            bucket_end_date: new Date('2024-02-29'),
            transactions: [
              {
                date: new Date('2024-02-05T08:00:00.000Z'),
                amount: 15,
                transaction_code: 'buy',
                symbol: 'NVDA',
                price: '200.00',
                total: '3000.00',
              },
              {
                date: new Date('2024-02-03T08:00:00.000Z'),
                amount: 20,
                transaction_code: 'buy',
                symbol: 'GOOG',
                price: '150.00',
                total: '3000.00',
              },
              {
                date: new Date('2024-02-07T08:00:00.000Z'),
                amount: 12,
                transaction_code: 'sell',
                symbol: 'TSLA',
                price: '180.00',
                total: '2160.00',
              },
              {
                date: new Date('2024-02-09T08:00:00.000Z'),
                amount: 8,
                transaction_code: 'buy',
                symbol: 'AMZN',
                price: '140.00',
                total: '1120.00',
              },
            ],
          },
        ],
      }),
    );

    const overview = await firstValueFrom(
      service.getCustomerOverview('john_doe'),
    );

    expect(accountService.getAccountById).toHaveBeenCalledWith(101);
    expect(transactionService.getTransactionsByAccount).toHaveBeenCalledWith({
      account_id: 101,
    });
    expect(overview.accounts).toEqual([
      {
        account_id: 101,
        limit: 10000,
        products: ['InvestmentStock'],
      },
    ]);
    expect(overview.recentTransactionsByAccount['101']).toHaveLength(5);
    expect(
      overview.recentTransactionsByAccount['101'].map(
        (transaction) => transaction.symbol,
      ),
    ).toEqual(['AMZN', 'TSLA', 'NVDA', 'GOOG', 'MSFT']);
  });

  it('returns an empty overview map when a customer has no linked accounts', async () => {
    customerGrpcService.getCustomer.mockReturnValue(
      of({
        username: 'john_doe',
        name: 'John Doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        accounts: [],
        tier_and_details: {},
      }),
    );

    const overview = await firstValueFrom(
      service.getCustomerOverview('john_doe'),
    );

    expect(overview.accounts).toEqual([]);
    expect(overview.recentTransactionsByAccount).toEqual({});
    expect(accountService.getAccountById).not.toHaveBeenCalled();
    expect(transactionService.getTransactionsByAccount).not.toHaveBeenCalled();
  });

  it('throws a not found exception when the customer lookup fails', async () => {
    customerGrpcService.getCustomer.mockReturnValue(
      throwError(() => new Error('customer missing')),
    );

    await expect(
      firstValueFrom(service.getCustomerOverview('missing_customer')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws a not found exception when a linked account cannot be resolved', async () => {
    customerGrpcService.getCustomer.mockReturnValue(
      of({
        username: 'john_doe',
        name: 'John Doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        accounts: [404],
        tier_and_details: {},
      }),
    );
    accountService.getAccountById.mockReturnValue(
      throwError(() => new Error('account missing')),
    );

    await expect(
      firstValueFrom(service.getCustomerOverview('john_doe')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns partial results when one account transaction lookup fails', async () => {
    customerGrpcService.getCustomer.mockReturnValue(
      of({
        username: 'john_doe',
        name: 'John Doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        accounts: [101, 202],
        tier_and_details: {},
      }),
    );
    accountService.getAccountById.mockImplementation((accountId: number) =>
      of({
        account: {
          account_id: accountId,
          limit: 10000,
          products: ['InvestmentStock'],
        },
      }),
    );
    transactionService.getTransactionsByAccount.mockImplementation(
      ({ account_id }) => {
        if (account_id === 101) {
          return throwError(() => new Error('transactions unavailable'));
        }

        return of({
          buckets: [
            {
              account_id,
              transaction_count: 1,
              bucket_start_date: new Date('2024-02-01'),
              bucket_end_date: new Date('2024-02-29'),
              transactions: [
                {
                  date: new Date('2024-02-10T08:00:00.000Z'),
                  amount: 2,
                  transaction_code: 'buy',
                  symbol: 'IBM',
                  price: '135.00',
                  total: '270.00',
                },
              ],
            },
          ],
        });
      },
    );

    const overview = await firstValueFrom(
      service.getCustomerOverview('john_doe'),
    );

    expect(overview.accounts).toHaveLength(2);
    expect(overview.recentTransactionsByAccount['101']).toEqual([]);
    expect(overview.recentTransactionsByAccount['202']).toEqual([
      {
        date: '2024-02-10T08:00:00.000Z',
        amount: 2,
        transaction_code: 'buy',
        symbol: 'IBM',
        price: '135.00',
        total: '270.00',
      },
    ]);
  });
});
