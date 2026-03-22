import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ACCOUNTS_SERVICE,
  CUSTOMERS_SERVICE,
  TRANSACTIONS_SERVICE,
} from './grpc-client.constants';

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
        },
      },
      {
        name: CUSTOMERS_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'customer.v1',
          protoPath: join(process.cwd(), 'proto/customers.proto'),
          url: process.env.CUSTOMERS_URL ?? '0.0.0.0:5002',
        },
      },
      {
        name: TRANSACTIONS_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'transaction.v1',
          protoPath: join(process.cwd(), 'proto/transactions.proto'),
          url: process.env.TRANSACTIONS_URL ?? '0.0.0.0:5003',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
