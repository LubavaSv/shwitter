import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagEntity } from '../db/entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HashtagEntity])],
  providers: [HashtagsService],
  exports: [HashtagsService],
})
export class HashtagsModule {}
