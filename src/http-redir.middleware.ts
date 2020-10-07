import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HttpRedirMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.secure) {
      res.redirect(
        307,
        'https://' +
          req.headers.host.replace(
            `${process.env.PORT}`,
            `${process.env.SECURE_PORT}`,
          ) +
          req.baseUrl,
      );
    } else {
      next();
    }
  }
}
