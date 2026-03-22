import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AccountsModule } from './accounts.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'account.v1',
        protoPath: join(process.cwd(), 'proto/accounts.proto'),
        url: process.env.ACCOUNTS_URL ?? '0.0.0.0:5001',
      },
    },
  );
  await app.listen();
}
void bootstrap();
