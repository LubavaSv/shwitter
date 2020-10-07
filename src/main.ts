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

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../certificate/key.pem'),
  cert: fs.readFileSync(__dirname + '/../certificate/cert.pem'),
};

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(HttpRedirMiddleware);
  http.createServer(server).listen(process.env.PORT || 3000);
  https
    .createServer(httpsOptions, server)
    .listen(process.env.SECURE_PORT || 443);
}
bootstrap();
