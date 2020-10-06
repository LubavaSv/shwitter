import { HashtagEntity } from '../../db/entities/hashtag.entity';

export interface CreatePostDto {
  text: string;
  image?: string;
  hashtags?: HashtagEntity[];
}
