import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../db/entities/post.entity';
import { UsersModule } from '../users/users.module';
import { HashtagsModule } from '../hashtags/hashtags.module';

@Module({
  imports: [
    UsersModule,
    HashtagsModule,
    TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
