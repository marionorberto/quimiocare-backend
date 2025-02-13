import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Posts } from '../posts/posts.entity';

@Entity('Post_Comments')
export class PostComments {
  @PrimaryGeneratedColumn('uuid', { name: 'post_comment_id' })
  postCommentId: string;

  @Column({ name: 'comment', type: 'varchar', length: '300' })
  comment: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Posts, (post) => post.comments)
  post: Posts;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updateAt: Date;
}
