import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/filters/all-exceptions.filter';
import { createLogger } from './utils/loggers/logger.config';
import { TransformResponseInterceptor } from './utils/interceptors/response.interceptor';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import { initWebSocket } from './websocket'; // ✅ import your WebSocket initializer
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(), // ✅ use Winston logger
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Cookie parser middleware
  app.use(cookieParser());

  //middleware
  app.enableCors({
    // origin: '*', // Allow all origins - adjust as needed
    origin: 'http://localhost:4203', // Angular app URL
    credentials: true, // Allow cookies
  }); // Enable CORS for all origins - adjust as needed

  // Get Winston logger and apply filters/interceptors globally
  const logger = app.get('NestWinston');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes non-decorated fields
      forbidNonWhitelisted: true, // throws if unknown fields are sent
      transform: true, // automatically transform types
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TechService360 API')
    .setDescription('TechService360 API, API description')
    .setVersion('1.0')
    // .addServer('/services') // 👈 VERY IMPORTANT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('services/api', app, document);

  const port = process.env.PORT ?? 4004;

  // Start Nest server
  const server = await app.listen(port);

  // ✅ Initialize WebSocket after Nest starts
  initWebSocket(server);
}

bootstrap();
