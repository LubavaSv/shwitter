import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { HashtagEntity } from './hashtag.entity';
import { UserEntity } from './user.entity';

@Entity('Comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(type => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: PostEntity;

  @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToMany(type => HashtagEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'comment_hashtag' })
  hashtags: HashtagEntity[];
}
