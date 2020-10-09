import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CommentDataDto } from './dto/commentData.dto';
import { QueryCommentDto } from './dto/query.comment.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostDataDto } from '../posts/dto/postData.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async createPost(
    @Request() req,
    @Param('postId') postId: number,
    @Body() commentData: CommentDataDto,
  ) {
    await this.commentsService.createComment(commentData, postId, req.user.id);
  }

  @Get()
  @ApiBadRequestResponse()
  async getComments(
    @Param('postId') postId: number,
    @Query() queryObj: QueryCommentDto,
  ) {
    return this.commentsService.getComments(queryObj, postId);
  }

  @Get('/:id')
  @ApiNotFoundResponse()
  async getCommentById(@Param('id') id: number) {
    return await this.commentsService.getCommentById(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthenticationGuard)
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async deletePost(@Param('id') id: number, @Request() req) {
    const comment = await this.commentsService.getCommentById(id);
    if (!comment) throw new NotFoundException();
    if (comment.user.id !== req.user.id) throw new ForbiddenException();
    await this.commentsService.deleteComment(id);
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
    @Body() updateData: UpdateCommentDto,
  ) {
    const post = await this.commentsService.getCommentById(id);
    if (!post) throw new NotFoundException();
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.commentsService.updateComment(id, updateData);
  }
}
