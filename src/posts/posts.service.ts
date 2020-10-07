import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../db/entities/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.post.dto';
import { UsersService } from '../users/users.service';
import { PostDataDto } from './dto/postData.dto';
import { HashtagEntity } from '../db/entities/hashtag.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { QueryPostDto } from './dto/query.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private usersService: UsersService,
    private hashtagsService: HashtagsService,
  ) {}

  private async parseHashtags(HtStrings: string[]): Promise<HashtagEntity[]> {
    const hashtags: HashtagEntity[] = [];
    if (HtStrings) {
      for (let i = 0; i < HtStrings.length; i++) {
        const ht = await this.hashtagsService.findHashtag(HtStrings[i]);
        ht ? hashtags.push(ht) : hashtags.push(new HashtagEntity(HtStrings[i]));
      }
    }
    return hashtags;
  }

  private async appendPostWithUser(postData: CreatePostDto, userId: number) {
    const user = await this.usersService.getUserById(userId);
    const postWithUser = await this.postsRepository.create(postData);
    postWithUser.user = user;
    return postWithUser;
  }

  private generateSQLQuery(queryObj): string {
    let SQLQuery: string = 'SELECT "Post".*\n' + 'FROM "Post"\n';

    if (queryObj.hasOwnProperty('hashtag')) {
      SQLQuery +=
        `INNER JOIN "Hashtag" ON "Hashtag".TAG = '${queryObj.hashtag}'\n` +
        'INNER JOIN post_hashtag  ON "Post".ID = post_hashtag."postId"\n' +
        'AND "Hashtag".id = post_hashtag."hashtagId"\n';
    }
    let command = 'WHERE';
    if (queryObj.hasOwnProperty('userid')) {
      SQLQuery += `WHERE "Post".user_id = ${queryObj.userid}\n `;
      command = 'AND';
    }
    if (queryObj.hasOwnProperty('text')) {
      SQLQuery += `${command} "Post".text LIKE '%${queryObj.text}%'\n`;
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

  async createPost(postData: PostDataDto, userId: number): Promise<PostEntity> {
    const post: CreatePostDto = {
      ...postData,
      hashtags: await this.parseHashtags(postData.hashtags),
    };
    const postWithUser = await this.appendPostWithUser(post, userId);
    await this.postsRepository.save(postWithUser);
    return postWithUser;
  }

  async getPosts(queryObj: QueryPostDto): Promise<PostEntity[]> {
    const SQLQuery = this.generateSQLQuery(queryObj);
    return this.postsRepository.query(SQLQuery);
  }

  async getPostById(postId: number) {
    return this.postsRepository
      .createQueryBuilder('post')
      .where({ id: postId })
      .innerJoin('post.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .leftJoinAndSelect('post.hashtags', 'hashtags')
      .getOne();
  }

  async deletePost(postId: number): Promise<DeleteResult> {
    const deleted = await this.postsRepository.delete({ id: postId });
    return deleted;
  }

  async updatePost(id: number, update: UpdatePostDto): Promise<PostEntity> {
    await this.postsRepository.update(id, update);
    return this.getPostById(id);
  }
}
