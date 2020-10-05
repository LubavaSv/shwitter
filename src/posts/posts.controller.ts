import { Body, Request, Controller, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import JwtAuthenticationGuard from '../auth/jwt-auth.guard';
import { PostDataDto } from './dto/postData.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Request() req, @Body() postData: PostDataDto) {
    await this.postsService.create(postData, req.user.id);
  }
}
