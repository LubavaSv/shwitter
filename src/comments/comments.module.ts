import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { UsersModule } from '../users/users.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts/posts.module';
import { CommentEntity } from '../db/entities/comment.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    UsersModule,
    HashtagsModule,
    PostsModule,
    TypeOrmModule.forFeature([CommentEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
