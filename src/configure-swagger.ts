import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CampusRate API')
    .setDescription(
      'REST API for consulting campus places and publishing reviews.',
    )
    .setVersion('1.0.0')
  .addTag('Places', 'Manage campus places')
  .addTag('Reviews', 'Manage campus reviews')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
    customSiteTitle: 'CampusRate API — Documentation',
  });
}
