import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from '../health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should ping accounts', () => {
    expect(healthController.pingAccounts()).toBeDefined();
  });

  it('should ping customers', () => {
    expect(healthController.pingCustomers()).toBeDefined();
  });

  it('should ping transactions', () => {
    expect(healthController.pingTransactions()).toBeDefined();
  });
});
