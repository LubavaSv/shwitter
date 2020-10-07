import { HttpRedirMiddleware } from './http-redir.middleware';

describe('HttpRedirMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpRedirMiddleware()).toBeDefined();
  });
});
