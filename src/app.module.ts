import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './db/database.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { HttpRedirMiddleware } from './http-redir.middleware';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './public/images' }),
    DatabaseModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    HashtagsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRedirMiddleware).forRoutes('*');
  }
}
