import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Hashtag')
export class HashtagEntity {
  constructor(tag) {
    this.tag = tag;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false})
  tag: string;
}
