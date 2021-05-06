import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';

const serverConfig = config.get('server');
const port = process.env.PORT || serverConfig.port;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('blog-api');

  const optionsSwagg = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('Description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, optionsSwagg);
  SwaggerModule.setup('blog-api/docs', app, document);
  await app.listen(port);
}
bootstrap();
