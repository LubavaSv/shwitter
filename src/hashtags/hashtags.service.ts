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
  async findHashtagById(id: number): Promise<HashtagEntity> {
    return this.hashtagRepository.findOne(id);
  }
  async findHashtagsByPostId(postId: number): Promise<HashtagEntity> {
    return this.hashtagRepository.query(
      'SELECT "Hashtag".*\n' +
        'FROM "Hashtag"\n' +
        'INNER JOIN post_hashtag ON post_hashtag."postId" = $1\n' +
        'WHERE post_hashtag."hashtagId" = "Hashtag".ID',
      [postId],
    );
  }
  async parseHashtags(HtStrings: string[]): Promise<HashtagEntity[]> {
    const hashtags: HashtagEntity[] = [];
    if (HtStrings) {
      for (let i = 0; i < HtStrings.length; i++) {
        const ht = await this.findHashtag(HtStrings[i]);
        ht ? hashtags.push(ht) : hashtags.push(new HashtagEntity(HtStrings[i]));
      }
    }
    return hashtags;
  }
}
