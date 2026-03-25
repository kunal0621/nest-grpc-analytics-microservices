import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './schemas/account.schema';

describe('AccountsController', () => {
  let accountsController: AccountsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account.name),
          useValue: {},
        },
      ],
    }).compile();

    accountsController = app.get<AccountsController>(AccountsController);
  });

  describe('ping', () => {
    it('should return a ping message', () => {
      expect(accountsController.ping()).toEqual({
        message: 'Accounts service is up and running!',
      });
    });
  });
});
