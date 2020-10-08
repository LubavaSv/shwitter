import { HashtagEntity } from '../../db/entities/hashtag.entity';

export interface CreateCommentDto {
  text: string;
  image?: string;
  hashtags?: HashtagEntity[];
}
