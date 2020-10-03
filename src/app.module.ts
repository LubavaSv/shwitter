import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfig from '../ormconfig.js'
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './db/database.module';
// import { PostsModule } from './posts/posts.module';
// import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule/*,
    PostsModule,
    CommentsModule*/
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
