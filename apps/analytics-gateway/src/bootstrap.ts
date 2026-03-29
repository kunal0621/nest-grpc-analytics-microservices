import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function parseCorsAllowedOrigins(
  allowedOrigins = process.env.CORS_ALLOWED_ORIGINS,
): string[] {
  return (allowedOrigins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function configureApp(
  app: Pick<INestApplication, 'enableCors' | 'useGlobalPipes'>,
) {
  const corsOrigins = parseCorsAllowedOrigins();

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Analytics API Gateway')
    .setDescription('The Analytics REST API exposed by the Gateway')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
}
