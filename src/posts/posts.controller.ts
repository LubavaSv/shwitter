import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  Query,
  Param,
  Delete,
  ForbiddenException,
  Put,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import JwtAuthenticationGuard from '../auth/guards/jwt-auth.guard';
import { PostDataDto } from './dto/postData.dto';
import { QueryPostDto } from './dto/query.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Request() req, @Body() postData: PostDataDto) {
    await this.postsService.createPost(postData, req.user.id);
  }

  @Get()
  async getPosts(@Query() queryObj: QueryPostDto) {
    return this.postsService.getPosts(queryObj);
  }

  @Get('/:id')
  async getPostById(@Param() param) {
    return this.postsService.getPostById(param.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePost(@Param() param, @Request() req) {
    const post = await this.postsService.getPostById(param.id);
    if (!post) throw new NotFoundException();
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.postsService.deletePost(param.id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updatePost(
    @Param() param,
    @Request() req,
    @Body() updateData: UpdatePostDto,
  ) {
    const post = await this.postsService.getPostById(param.id);
    if (!post) throw new NotFoundException();
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.postsService.updatePost(param.id, updateData);
  }
}
