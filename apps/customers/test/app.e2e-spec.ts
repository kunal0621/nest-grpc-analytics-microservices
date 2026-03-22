import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CustomersModule } from './../src/customers.module';

describe('CustomersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CustomersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
