import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagEntity } from '../db/entities/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(HashtagEntity)
    private hashtagRepository: Repository<HashtagEntity>,
  ) {}

  async findHashtag(ht: string): Promise<HashtagEntity> {
    return this.hashtagRepository.findOne({ tag: ht });
  }
}
