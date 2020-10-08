import { BadRequestException } from '@nestjs/common';

export class UniqueViolationException extends BadRequestException {
  constructor() {
    super(`User with such name or email already exists`);
  }
}
