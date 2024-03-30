import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Youtube Sharing app')
    .setDescription('The Youtube Sharing app API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.debug(`typeof PORT: ${typeof configService.get('PORT')}`);
  await app.listen(configService.get('PORT'), () =>
    logger.log(`Application running on port ${configService.get('PORT')}`),
  );
}
bootstrap();
