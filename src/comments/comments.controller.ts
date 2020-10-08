import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(
    @Request() req,
    @Param('postId') postId,
    @Body() commentData: CommentDataDto,
  ) {
    await this.commentsService.createComment(commentData, postId, req.user.id);
  }

  @Get()
  async getComments(
    @Param('postId') postId,
    @Query() queryObj: QueryCommentDto,
  ) {
    return this.commentsService.getComments(queryObj, postId);
  }

  @Get('/:id')
  async getCommentById(@Param() param) {
    return await this.commentsService.getCommentById(param.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePost(@Param() param, @Request() req) {
    const comment = await this.commentsService.getCommentById(param.id);
    if (!comment) throw new NotFoundException();
    if (comment.user.id !== req.user.id) throw new ForbiddenException();
    return this.commentsService.deleteComment(param.id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updatePost(
    @Param() param,
    @Request() req,
    @Body() updateData: UpdateCommentDto,
  ) {
    const post = await this.commentsService.getCommentById(param.id);
    if (!post) throw new NotFoundException();
    if (post.user.id !== req.user.id) throw new ForbiddenException();
    return this.commentsService.updateComment(param.id, updateData);
  }
}
