/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../account.service';
import { of } from 'rxjs';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: jest.Mocked<AccountService>;

  beforeEach(async () => {
    const mockAccountService = {
      pingAccounts: jest.fn(),
      getAccounts: jest.fn(),
      createAccount: jest.fn(),
      getAccountById: jest.fn(),
      updateAccountLimit: jest.fn(),
      addProductToAccount: jest.fn(),
      removeProductFromAccount: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
    accountService = app.get(AccountService);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('pingAccounts', () => {
    it('should call accountService.pingAccounts and return the result', (done) => {
      const mockResponse = { message: 'Accounts service is up and running!' };
      accountService.pingAccounts.mockReturnValue(of(mockResponse));

      accountController.pingAccounts().subscribe((result) => {
        expect(accountService.pingAccounts).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getAccounts', () => {
    it('should call accountService.getAccounts with default limit and return the result', (done) => {
      const mockResponse = { accounts: [] };
      accountService.getAccounts.mockReturnValue(of(mockResponse));

      accountController.getAccounts({}).subscribe((result) => {
        expect(accountService.getAccounts).toHaveBeenCalledWith(9000);
        expect(result).toEqual(mockResponse);
        done();
      });
    });

    it('should call accountService.getAccounts with provided limit and return the result', (done) => {
      const mockResponse = { accounts: [] };
      const limit = 5000;
      accountService.getAccounts.mockReturnValue(of(mockResponse));

      accountController.getAccounts({ limit }).subscribe((result) => {
        expect(accountService.getAccounts).toHaveBeenCalledWith(limit);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('createAccount', () => {
    it('should call accountService.createAccount with data and return the result', (done) => {
      const mockData = { account_id: 12345, limit: 10000, products: ['Stock'] };
      const mockResponse = { account: mockData };
      accountService.createAccount.mockReturnValue(of(mockResponse));

      accountController.createAccount(mockData).subscribe((result) => {
        expect(accountService.createAccount).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getAccountById', () => {
    it('should call accountService.getAccountById with account_id and return the result', (done) => {
      const account_id = 12345;
      const mockResponse = {
        account: { account_id, limit: 10000, products: [] },
      };
      accountService.getAccountById.mockReturnValue(of(mockResponse));

      accountController.getAccountById(account_id).subscribe((result) => {
        expect(accountService.getAccountById).toHaveBeenCalledWith(account_id);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('updateAccountLimit', () => {
    it('should call accountService.updateAccountLimit with account_id and data and return the result', (done) => {
      const account_id = 12345;
      const new_limit = 15000;
      const mockResponse = {
        account: { account_id, limit: new_limit, products: [] },
      };
      accountService.updateAccountLimit.mockReturnValue(of(mockResponse));

      accountController
        .updateAccountLimit(account_id, { new_limit })
        .subscribe((result) => {
          expect(accountService.updateAccountLimit).toHaveBeenCalledWith({
            account_id,
            new_limit,
          });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('addProductToAccount', () => {
    it('should call accountService.addProductToAccount with account_id and data and return the result', (done) => {
      const account_id = 12345;
      const product = 'InvestmentStock';
      const mockResponse = {
        account: { account_id, limit: 10000, products: [product] },
      };
      accountService.addProductToAccount.mockReturnValue(of(mockResponse));

      accountController
        .addProductToAccount(account_id, { product })
        .subscribe((result) => {
          expect(accountService.addProductToAccount).toHaveBeenCalledWith({
            account_id,
            product,
          });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('removeProductFromAccount', () => {
    it('should call accountService.removeProductFromAccount with account_id and product and return the result', (done) => {
      const account_id = 12345;
      const product = 'InvestmentStock';
      const mockResponse = {
        account: { account_id, limit: 10000, products: [] },
      };
      accountService.removeProductFromAccount.mockReturnValue(of(mockResponse));

      accountController
        .removeProductFromAccount(account_id, product)
        .subscribe((result) => {
          expect(accountService.removeProductFromAccount).toHaveBeenCalledWith({
            account_id,
            product,
          });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });
});
