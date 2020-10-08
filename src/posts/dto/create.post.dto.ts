import { HashtagEntity } from '../../db/entities/hashtag.entity';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  text: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsOptional()
  hashtags?: HashtagEntity[];
}
