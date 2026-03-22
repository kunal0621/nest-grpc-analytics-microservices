import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TransactionsModule } from './../src/transactions.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
