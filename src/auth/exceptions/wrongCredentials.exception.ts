import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsException extends BadRequestException {
  constructor() {
    super(`Wrong credentials provided`);
  }
}
