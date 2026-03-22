import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionsModule } from './transactions.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'transaction.v1',
        protoPath: join(process.cwd(), 'proto/transactions.proto'),
        url: process.env.TRANSACTIONS_URL ?? '0.0.0.0:5003',
      },
    },
  );
  await app.listen();
}
void bootstrap();
