import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './configure-app.js';
import { configureSwagger } from './configure-swagger.js';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

async function bootstrap() {
  // https certification
  const httpsOptions = {
    key: readFileSync('certs/server.key'),
    cert: readFileSync('certs/server.cert'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  configureApp(app);
  configureSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
    // Rediriger les requêtes HTTP vers le serveur HTTPS
  createServer((req, res) => {
    res.writeHead(308, {
      Location: `https://localhost:${port}${req.url ?? '/'}`,
    });
    res.end();
  }).listen(3001);
}

await bootstrap();