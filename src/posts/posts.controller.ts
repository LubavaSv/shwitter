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
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import JwtAuthenticationGuard from '../auth/guards/jwt-auth.guard';
import { PostDataDto } from './dto/postData.dto';
import { QueryPostDto } from './dto/query.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async createPost(@Request() req, @Body() postData: PostDataDto) {
    await this.postsService.createPost(postData, req.user.id);
  }

  @Get()
  @ApiQuery(QueryPostDto)
  @ApiBadRequestResponse()
  async getPosts(@Query() queryObj: QueryPostDto) {
    return this.postsService.getPosts(queryObj);
  }

  @Get('/:id')
  @ApiNotFoundResponse()
  async getPostById(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthenticationGuard)
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async deletePost(@Param('id') id: number, @Request() req) {
    const post = await this.postsService.getPostById(id);
    if (!post) throw new NotFoundException();
    // TODO: use guard
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.postsService.deletePost(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  async updatePost(
    @Param('id') id: number,
    @Request() req,
    @Body() updateData: UpdatePostDto,
  ) {
    if (Object.keys(updateData).length === 0) throw new BadRequestException();
    const post = await this.postsService.getPostById(id);
    if (!post) throw new NotFoundException();
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.postsService.updatePost(id, updateData);
  }
}
