import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HealthController } from './health/controllers/health.controller';
import { HealthService } from './health/health.service';
import { AccountController } from './accounts/controllers/account.controller';
import { CustomerController } from './customers/controllers/customer.controller';
import { TransactionController } from './transactions/controllers/transaction.controller';
import { AccountService } from './accounts/account.service';
import { CustomerService } from './customers/customer.service';
import { TransactionService } from './transactions/transaction.service';
import {
  ACCOUNTS_SERVICE,
  CUSTOMERS_SERVICE,
  TRANSACTIONS_SERVICE,
} from './health/constants/grpc-client.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ACCOUNTS_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'account.v1',
          protoPath: join(process.cwd(), 'proto/accounts.proto'),
          url: process.env.ACCOUNTS_URL ?? '0.0.0.0:5001',
          loader: { keepCase: true },
        },
      },
      {
        name: CUSTOMERS_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'customer.v1',
          protoPath: join(process.cwd(), 'proto/customers.proto'),
          url: process.env.CUSTOMERS_URL ?? '0.0.0.0:5002',
          loader: { keepCase: true },
        },
      },
      {
        name: TRANSACTIONS_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'transaction.v1',
          protoPath: join(process.cwd(), 'proto/transactions.proto'),
          url: process.env.TRANSACTIONS_URL ?? '0.0.0.0:5003',
          loader: { keepCase: true },
        },
      },
    ]),
  ],
  controllers: [
    HealthController,
    AccountController,
    CustomerController,
    TransactionController,
  ],
  providers: [
    HealthService,
    AccountService,
    CustomerService,
    TransactionService,
  ],
})
export class AppModule {}
