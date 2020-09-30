import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-dotenv';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), UsersModule, PostsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
