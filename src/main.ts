import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './configure-app.js';
import { configureSwagger } from './configure-swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);
  configureSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
}

await bootstrap();
