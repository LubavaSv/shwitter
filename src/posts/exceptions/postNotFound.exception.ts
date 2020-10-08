import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Post ${postId} not found`);
  }
}
