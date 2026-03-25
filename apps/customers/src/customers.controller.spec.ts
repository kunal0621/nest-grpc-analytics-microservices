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
});
