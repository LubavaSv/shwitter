import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as https from 'https';
import * as http from 'http';
import { HttpRedirMiddleware } from './http-redir.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../certificate/key.pem'),
  cert: fs.readFileSync(__dirname + '/../certificate/cert.pem'),
};

const port = process.env.PORT || 3000;
const securePort = process.env.SECURE_PORT || 443;

const options = new DocumentBuilder()
  .setTitle('Shwitter')
  .setDescription('Shwitter API')
  .setVersion('1.0')
  .build();

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.init();
  app.useGlobalPipes(new ValidationPipe());
  app.use(HttpRedirMiddleware);

  http.createServer(server).listen(port);
  https.createServer(httpsOptions, server).listen(securePort);
}
bootstrap();
