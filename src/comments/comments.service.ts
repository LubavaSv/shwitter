import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteQueryBuilder, DeleteResult, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { HashtagsService } from '../hashtags/hashtags.service';
import { CommentEntity } from '../db/entities/comment.entity';
import { CreateCommentDto } from './dto/create.comment.dto';
import { PostsService } from '../posts/posts.service';
import { CommentDataDto } from './dto/commentData.dto';
import { QueryPostDto } from '../posts/dto/query.post.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';
import { QueryCommentDto } from './dto/query.comment.dto';
import { CommentNotFoundException } from './exceptions/CommentNotFound.exception';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
    private usersService: UsersService,
    private postsService: PostsService,
    private hashtagsService: HashtagsService,
  ) {}

  private async appendCommentWithUser(
    commentData: CreateCommentDto,
    userId: number,
  ) {
    const user = await this.usersService.getUserById(userId);
    const commentWithUser = await this.commentsRepository.create(commentData);
    commentWithUser.user = user;
    return commentWithUser;
  }

  private async appendCommentWithPost(
    commentData: CreateCommentDto,
    postId: number,
  ) {
    const post = await this.postsService.getPostById(postId);
    const commentWithPost = await this.commentsRepository.create(commentData);
    commentWithPost.post = post;
    return commentWithPost;
  }

  private generateSQLQuery(postId, queryObj): string {
    let SQLQuery: string = 'SELECT "Comment".*\n' + 'FROM "Comment"\n';

    SQLQuery += `WHERE "Comment".post_id = ${postId}`;
    if (queryObj.hasOwnProperty('hashtag')) {
      SQLQuery +=
        `INNER JOIN "Hashtag" ON "Hashtag".TAG = '${queryObj.hashtag}'\n` +
        'INNER JOIN comment_hashtag  ON "Comment".ID = comment_hashtag."commentId"\n' +
        'AND "Hashtag".id = comment_hashtag."hashtagId"\n';
    }
    if (queryObj.hasOwnProperty('userid')) {
      SQLQuery += `AND "Comment".user_id = ${queryObj.userid}\n `;
    }
    if (queryObj.hasOwnProperty('text')) {
      SQLQuery += `AND "Comment".text LIKE '%${queryObj.text}%'\n`;
    }
    if (queryObj.hasOwnProperty('limit')) {
      SQLQuery += `LIMIT ${queryObj.limit} `;
    } else {
      SQLQuery += `LIMIT 20 `;
    }
    if (queryObj.hasOwnProperty('page')) {
      SQLQuery += `OFFSET ${(queryObj.page - 1) * queryObj.limit}`;
    } else {
      SQLQuery += `OFFSET 0`;
    }
    return SQLQuery;
  }

  async createComment(
    commentData: CommentDataDto,
    postId: number,
    userId: number,
  ): Promise<CommentEntity> {
    const comment: CreateCommentDto = {
      ...commentData,
      hashtags: await this.hashtagsService.parseHashtags(commentData.hashtags),
    };
    const commWithUser = await this.appendCommentWithUser(comment, userId);
    const commWithUsersPost = await this.appendCommentWithPost(
      commWithUser,
      postId,
    );
    await this.commentsRepository.save(commWithUsersPost);
    return commWithUsersPost;
  }

  async getComments(
    queryObj: QueryCommentDto,
    postId: number,
  ): Promise<CommentEntity[]> {
    const SQLQuery = this.generateSQLQuery(postId, queryObj);
    return this.commentsRepository.query(SQLQuery);
  }

  async getCommentById(id: number): Promise<CommentEntity> {
    const comm = await this.commentsRepository
      .createQueryBuilder('comment')
      .where({ id })
      .innerJoin('comment.post', 'post')
      .addSelect(['post.id'])
      .innerJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .leftJoinAndSelect('comment.hashtags', 'hashtags')
      .getOne();
    if (!comm) throw new CommentNotFoundException(id);
    return comm;
  }

  async deleteComment(id: number): Promise<boolean> {
    const deleted = await this.commentsRepository.delete(id);
    if (deleted.affected === 0) {
      throw new CommentNotFoundException(id);
    }
    return true;
  }

  async updateComment(
    id: number,
    updateRaw: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const updatePrimary = { text: updateRaw.text, image: updateRaw.image };
    await this.commentsRepository
      .createQueryBuilder('Comment')
      .update()
      .set(updatePrimary)
      .where({ id });
    const comment = await this.getCommentById(id);
    comment.hashtags = await this.hashtagsService.parseHashtags(
      updateRaw.hashtags,
    );
    await this.commentsRepository.save(comment);
    return this.getCommentById(id);
  }
}
