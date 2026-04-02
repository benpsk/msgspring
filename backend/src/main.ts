import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT') ?? 3000);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
