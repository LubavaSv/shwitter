import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HttpRedirMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('m');
    if (!req.secure) {
      res.redirect(
        'https://' +
          req.headers.host.replace(
            `${process.env.PORT}`,
            `${process.env.SECURE_PORT}`,
          ) +
          req.url,
      );
    } else {
      next();
    }
  }
}
