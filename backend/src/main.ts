import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  BODY_LIMIT,
  CORS_OPTIONS,
  RATE_LIMIT_OPTIONS,
  VALIDATION_PIPE_OPTIONS,
} from './config/app.config';
import { CSRF_OPTIONS, HELMET_OPTIONS } from './config/security.config';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import csrfProtection from '@fastify/csrf-protection';

async function bootstrap() {
  // Use FastifyAdapter instead of the default Express adapter
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit: BODY_LIMIT }),
  );

  // Set the global prefix for API routes
  app.setGlobalPrefix('api');

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));

  // Enable CORS
  const fastifyInstance = app.getHttpAdapter().getInstance();
  await fastifyInstance.register(cors, () => {
    return (req: any, callback: any) => {
      callback(null, CORS_OPTIONS);
    };
  });

  // Enable rate limiting
  await fastifyInstance.register(rateLimit, RATE_LIMIT_OPTIONS);

  // Enable Helmet for security headers
  await fastifyInstance.register(helmet, HELMET_OPTIONS);

  // Enable CSRF protection
  await fastifyInstance.register(csrfProtection, CSRF_OPTIONS);

  // Set up Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('My API') // Title of the API documentation
    .setDescription('The API description') // Description of the API
    .setVersion('1.0') // API version
    .addTag('users') // Tag to group endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at '/api/docs'

  await app.listen(process.env.APP_PORT);
}
bootstrap();
