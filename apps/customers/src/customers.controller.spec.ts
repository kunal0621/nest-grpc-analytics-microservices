import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './schemas/customer.schema';

describe('CustomersController', () => {
  let customersController: CustomersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        CustomersService,
        {
          provide: getModelToken(Customer.name),
          useValue: {},
        },
      ],
    }).compile();

    customersController = app.get<CustomersController>(CustomersController);
  });

  describe('ping', () => {
    it('should return a ping message', () => {
      expect(customersController.ping()).toEqual({
        message: 'Customers service is up and running!',
      });
    });
  });

  describe('getCustomer', () => {
    it('should return a customer', async () => {
      const customer = await customersController.getCustomer({
        username: 'test',
      });
      expect(customer).toEqual({
        username: 'test',
        name: 'test',
        address: 'test',
        birthdate: 'test',
        email: 'test',
        accounts: [],
        tier_and_details: {},
      });
    });
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const customer = await customersController.createCustomer({
        username: 'test',
        name: 'test',
        address: 'test',
        birthdate: 'test',
        email: 'test',
      });
      expect(customer).toEqual({
        username: 'test',
        name: 'test',
        address: 'test',
        birthdate: 'test',
        email: 'test',
      });
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      const customer = await customersController.updateCustomer({
        username: 'test',
        name: 'test',
        address: 'test',
        birthdate: 'test',
        email: 'test',
      });
      expect(customer).toEqual({
        username: 'test',
        name: 'test',
        address: 'test',
        birthdate: 'test',
        email: 'test',
      });
    });
  });

  describe('listCustomers', () => {
    it('should list customers', async () => {
      const customers = await customersController.listCustomers({
        limit: 10,
      });
      expect(customers).toEqual({
        customers: [],
      });
    });
  });

  describe('addAccountToCustomer', () => {
    it('should add an account to a customer', async () => {
      const customer = await customersController.addAccountToCustomer({
        username: 'test',
        account_id: 1,
      });
      expect(customer).toEqual({
        username: 'test',
        account_id: 1,
      });
    });
  });

  describe('removeAccountFromCustomer', () => {
    it('should remove an account from a customer', async () => {
      const customer = await customersController.removeAccountFromCustomer({
        username: 'test',
        account_id: 1,
      });
      expect(customer).toEqual({
        username: 'test',
        account_id: 1,
      });
    });
  });
});
