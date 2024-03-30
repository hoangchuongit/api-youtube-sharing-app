import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction } from 'express';
import * as fs from 'fs';

const apiDocCredentials = {
  name: 'admin',
  pass: 'admin',
};

export function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Youtube Sharing App')
    .setDescription('## Youtube Sharing App API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('swagger.json', JSON.stringify(document));

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use('/docs', (req: any, res: any, next: NextFunction) => {
    function parseAuthHeader(input: string): { name: string; pass: string } {
      const [, encodedPart] = input.split(' ');

      const buff = Buffer.from(encodedPart, 'base64');
      const text = buff.toString('ascii');
      const [name, pass] = text.split(':');

      return { name, pass };
    }

    function unauthorizedResponse(): void {
      if (httpAdapter.getType() === 'fastify') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
      }

      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.name !== apiDocCredentials.name ||
      credentials?.pass !== apiDocCredentials.pass
    ) {
      return unauthorizedResponse();
    }

    next();
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customJs: '/swagger-custom.js',
    customSiteTitle: 'Youtube Sharing Documentation',
    customfavIcon: '/swagger.ico',
  });
}
