/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../transaction.service';
import { of } from 'rxjs';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const mockTransactionService = {
      pingTransactions: jest.fn(),
      recordTransaction: jest.fn(),
      getTransactionsByAccount: jest.fn(),
      getTransactionsBySymbol: jest.fn(),
      getTransactionBucketSummary: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
    transactionService = app.get(TransactionService);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('pingTransactions', () => {
    it('should call transactionService.pingTransactions and return the result', (done) => {
      const mockResponse = {
        message: 'Transactions service is up and running!',
      };
      transactionService.pingTransactions.mockReturnValue(of(mockResponse));

      transactionController.pingTransactions().subscribe((result) => {
        expect(transactionService.pingTransactions).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('recordTransaction', () => {
    it('should call transactionService.recordTransaction with data and return the result', (done) => {
      const mockData = {
        account_id: 12345,
        symbol: 'AAPL',
        transaction_code: 'BUY',
        amount: 100,
        price: '150.5',
        timestamp: new Date().toISOString(),
      };
      const mockResponse = { transaction_id: 'txn123', success: true };
      transactionService.recordTransaction.mockReturnValue(of(mockResponse));

      transactionController.recordTransaction(mockData).subscribe((result) => {
        expect(transactionService.recordTransaction).toHaveBeenCalledWith(
          mockData,
        );
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getTransactionsByAccount', () => {
    it('should call transactionService.getTransactionsByAccount with account_id and query params and return the result', (done) => {
      const account_id = 12345;
      const query = { start_date: '2024-01-01', end_date: '2024-12-31' };
      const mockResponse = { transactions: [], buckets: [] };
      transactionService.getTransactionsByAccount.mockReturnValue(
        of(mockResponse),
      );

      transactionController
        .getTransactionsByAccount(account_id, query)
        .subscribe((result) => {
          expect(
            transactionService.getTransactionsByAccount,
          ).toHaveBeenCalledWith({ account_id, ...query });
          expect(result).toEqual(mockResponse);
          done();
        });
    });

    it('should call transactionService.getTransactionsByAccount with account_id and no query params and return the result', (done) => {
      const account_id = 12345;
      const query = {};
      const mockResponse = { transactions: [], buckets: [] };
      transactionService.getTransactionsByAccount.mockReturnValue(
        of(mockResponse),
      );

      transactionController
        .getTransactionsByAccount(account_id, query)
        .subscribe((result) => {
          expect(
            transactionService.getTransactionsByAccount,
          ).toHaveBeenCalledWith({ account_id });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('getTransactionsBySymbol', () => {
    it('should call transactionService.getTransactionsBySymbol with params and return the result', (done) => {
      const params = { account_id: 12345, symbol: 'AAPL' };
      const mockResponse = { transactions: [], buckets: [] };
      transactionService.getTransactionsBySymbol.mockReturnValue(
        of(mockResponse),
      );

      transactionController
        .getTransactionsBySymbol(params.account_id, params.symbol)
        .subscribe((result) => {
          expect(
            transactionService.getTransactionsBySymbol,
          ).toHaveBeenCalledWith(params);
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('getTransactionBucketSummary', () => {
    it('should call transactionService.getTransactionBucketSummary with params and return the result', (done) => {
      const params = { account_id: 12345 };
      const mockResponse = {
        account_id: 12345,
        total_buckets: 5,
        total_transactions: 100,
        date_range: {
          earliest: new Date('2024-01-01'),
          latest: new Date('2024-12-31'),
        },
        summary: { total_volume: 1000, total_value: 150000 },
      };
      transactionService.getTransactionBucketSummary.mockReturnValue(
        of(mockResponse),
      );

      transactionController
        .getTransactionBucketSummary(params.account_id)
        .subscribe((result) => {
          expect(
            transactionService.getTransactionBucketSummary,
          ).toHaveBeenCalledWith(params);
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });
});
