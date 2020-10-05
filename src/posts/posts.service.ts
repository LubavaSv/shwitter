import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../db/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.post.dto';
import { UsersService } from '../users/users.service';
import { PostDataDto } from './dto/postData.dto';
import { HashtagEntity } from '../db/entities/hashtag.entity';
import { HashtagsService } from '../hashtags/hashtags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private usersService: UsersService,
    private hashtagsService: HashtagsService,
  ) {}

  async create(postData: PostDataDto, userId: number) {
    const post: CreatePostDto = {
      ...postData,
      hashtags: await this.parseHashtags(postData.hashtags),
    };
    const postWithUser = await this.appendPostWithUser(post, userId);
    await this.postsRepository.save(postWithUser);
    return postWithUser;
  }

  private async parseHashtags(HtStrings: string[]): Promise<HashtagEntity[]> {
    const hashtags: HashtagEntity[] = [];
    for (let i = 0; i < HtStrings.length; i++) {
      const ht = await this.hashtagsService.findHashtag(HtStrings[i]);
      ht ? hashtags.push(ht) : hashtags.push(new HashtagEntity(ht));
    }
    return hashtags;
  }

  private async appendPostWithUser(postData: CreatePostDto, userId: number) {
    const user = await this.usersService.getUserById(userId);
    const postWithUser = await this.postsRepository.create(postData);
    postWithUser.user = user;
    return postWithUser;
  }
}
