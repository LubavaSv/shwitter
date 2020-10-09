import { HttpException, HttpStatus } from '@nestjs/common';

export class NotNullViolation extends HttpException {
  constructor(field: string) {
    super(`Field ${field} cannot be empty`, HttpStatus.BAD_REQUEST);
  }
}
