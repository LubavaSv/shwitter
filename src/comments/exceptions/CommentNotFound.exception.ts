import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor(commId: number) {
    super(`Comment ${commId} not found`);
  }
}
