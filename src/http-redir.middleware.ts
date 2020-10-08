import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HttpRedirMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.secure) {
      const port = process.env.PORT || 3000;
      const secPort = process.env.SECURE_PORT || 443;
      res.redirect(
        307,
        'https://' +
          req.headers.host.replace(`${port}`, `${secPort}`) +
          req.baseUrl,
      );
    } else {
      next();
    }
  }
}
