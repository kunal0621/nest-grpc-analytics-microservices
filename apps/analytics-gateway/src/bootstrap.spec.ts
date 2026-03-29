import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { configureApp, parseCorsAllowedOrigins } from './bootstrap';

describe('bootstrap configuration', () => {
  const originalCorsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.CORS_ALLOWED_ORIGINS = originalCorsAllowedOrigins;
  });

  it('parses a comma-separated CORS allowlist from env', () => {
    process.env.CORS_ALLOWED_ORIGINS =
      'http://localhost:3001, https://frontend.example.com ';

    expect(parseCorsAllowedOrigins()).toEqual([
      'http://localhost:3001',
      'https://frontend.example.com',
    ]);
  });

  it('enables CORS with env-driven origins and global validation pipes', () => {
    process.env.CORS_ALLOWED_ORIGINS =
      'http://localhost:3001,https://frontend.example.com';

    const app = {
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
    } as unknown as Pick<INestApplication, 'enableCors' | 'useGlobalPipes'>;

    configureApp(app);

    expect(app.enableCors).toHaveBeenCalledWith({
      origin: ['http://localhost:3001', 'https://frontend.example.com'],
      credentials: true,
    });
    expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
  });
});
