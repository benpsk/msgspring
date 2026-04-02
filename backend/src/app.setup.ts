import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express';
import helmet from 'helmet';
import { buildValidationErrorMap } from './common/validation/validation-error-map';

function getAllowedOrigins(frontendOrigin?: string): string[] {
  if (!frontendOrigin) {
    return [];
  }

  return frontendOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const allowedOrigins = getAllowedOrigins(
    configService.get<string>('FRONTEND_ORIGIN'),
  );
  const httpAdapter = app.getHttpAdapter();

  if (httpAdapter.getType() === 'express') {
    (httpAdapter.getInstance() as Express).set('trust proxy', 1);
  }

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: 'Please correct the highlighted fields.',
          error: buildValidationErrorMap(errors),
        }),
    }),
  );
}
