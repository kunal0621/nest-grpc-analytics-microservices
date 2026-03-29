/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../customer.service';
import { of } from 'rxjs';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const mockCustomerService = {
      pingCustomers: jest.fn(),
      getCustomerOverview: jest.fn(),
      getCustomer: jest.fn(),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      listCustomers: jest.fn(),
      addAccountToCustomer: jest.fn(),
      removeAccountFromCustomer: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    customerController = app.get<CustomerController>(CustomerController);
    customerService = app.get(CustomerService);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });

  describe('pingCustomers', () => {
    it('should call customerService.pingCustomers and return the result', (done) => {
      const mockResponse = { message: 'Customers service is up and running!' };
      customerService.pingCustomers.mockReturnValue(of(mockResponse));

      customerController.pingCustomers().subscribe((result) => {
        expect(customerService.pingCustomers).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getCustomer', () => {
    it('should call customerService.getCustomer with username and return the result', (done) => {
      const username = 'john_doe';
      const mockResponse = {
        username,
        name: 'John Doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
        accounts: [12345],
        tier_and_details: {},
      };
      customerService.getCustomer.mockReturnValue(of(mockResponse));

      customerController.getCustomer(username).subscribe((result) => {
        expect(customerService.getCustomer).toHaveBeenCalledWith({ username });
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getCustomerOverview', () => {
    it('should call customerService.getCustomerOverview and return the result', (done) => {
      const username = 'john_doe';
      const mockResponse = {
        customer: {
          username,
          name: 'John Doe',
          address: '123 Main St',
          birthdate: '1990-01-01',
          email: 'john@example.com',
          accounts: [12345],
          tier_and_details: {},
        },
        accounts: [
          {
            account_id: 12345,
            limit: 10000,
            products: ['InvestmentStock'],
          },
        ],
        recentTransactionsByAccount: {
          '12345': [
            {
              date: '2024-02-01T09:00:00.000Z',
              amount: 50,
              transaction_code: 'buy',
              symbol: 'AAPL',
              price: '100.00',
              total: '5000.00',
            },
          ],
        },
      };
      customerService.getCustomerOverview.mockReturnValue(of(mockResponse));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      customerController.getCustomerOverview(username).subscribe((result) => {
        expect(customerService.getCustomerOverview).toHaveBeenCalledWith(
          username,
        );
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('createCustomer', () => {
    it('should call customerService.createCustomer with data and return the result', (done) => {
      const mockData = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'john_doe',
        address: '123 Main St',
        birthdate: '1990-01-01',
      };
      const mockResponse = {
        ...mockData,
      };
      customerService.createCustomer.mockReturnValue(of(mockResponse));

      customerController.createCustomer(mockData).subscribe((result) => {
        expect(customerService.createCustomer).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('updateCustomer', () => {
    it('should call customerService.updateCustomer with username and data and return the result', (done) => {
      const username = 'john_doe';
      const mockData = {
        name: 'John Doe',
        address: '456 Elm St',
        birthdate: '1990-01-01',
        email: 'john@example.com',
      };
      const mockResponse = {
        ...mockData,
        username,
      };
      customerService.updateCustomer.mockReturnValue(of(mockResponse));

      customerController
        .updateCustomer(username, mockData)
        .subscribe((result) => {
          expect(customerService.updateCustomer).toHaveBeenCalledWith({
            ...mockData,
            username,
          });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('listCustomers', () => {
    it('should call customerService.listCustomers with query params and return the result', (done) => {
      const query = { limit: 10, cursor: 'next_cursor' };
      const mockResponse = { customers: [], next_cursor: 'next_cursor' };
      customerService.listCustomers.mockReturnValue(of(mockResponse));

      customerController.listCustomers(query).subscribe((result) => {
        expect(customerService.listCustomers).toHaveBeenCalledWith({
          limit: query.limit,
          cursor: query.cursor,
        });
        expect(result).toEqual(mockResponse);
        done();
      });
    });

    it('should call customerService.listCustomers with default params when no query provided and return the result', (done) => {
      const query = { limit: 0 };
      const mockResponse = { customers: [], next_cursor: '' };
      customerService.listCustomers.mockReturnValue(of(mockResponse));

      customerController.listCustomers(query).subscribe((result) => {
        expect(customerService.listCustomers).toHaveBeenCalledWith({
          limit: query.limit,
          cursor: undefined,
        });
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('addAccountToCustomer', () => {
    it('should call customerService.addAccountToCustomer with username and data and return the result', (done) => {
      const username = 'john_doe';
      const mockData = { account_id: 12345 };
      const mockResponse = { username, account_id: mockData.account_id };
      customerService.addAccountToCustomer.mockReturnValue(of(mockResponse));

      customerController
        .addAccountToCustomer(username, mockData)
        .subscribe((result) => {
          expect(customerService.addAccountToCustomer).toHaveBeenCalledWith({
            username,
            account_id: mockData.account_id,
          });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('removeAccountFromCustomer', () => {
    it('should call customerService.removeAccountFromCustomer with username and account_id and return the result', (done) => {
      const username = 'john_doe';
      const account_id = 12345;
      const mockResponse = { username, account_id };
      customerService.removeAccountFromCustomer.mockReturnValue(
        of(mockResponse),
      );

      customerController
        .removeAccountFromCustomer(username, account_id)
        .subscribe((result) => {
          expect(
            customerService.removeAccountFromCustomer,
          ).toHaveBeenCalledWith({ username, account_id });
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });
});
