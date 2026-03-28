import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomersModule } from './customers.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomersModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'customer.v1',
        protoPath: join(process.cwd(), 'proto/customers.proto'),
        url: process.env.CUSTOMERS_URL ?? '0.0.0.0:5002',
        loader: { keepCase: true },
      },
    },
  );
  await app.listen();
}
void bootstrap();
