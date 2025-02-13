import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Posts } from '../posts/posts.entity';
import { User } from '../users/user.entity';

@Entity('Post_Likes')
export class PostLikes {
  @PrimaryGeneratedColumn('uuid', { name: 'post_like_id' })
  postLikeId: string;

  @Column({ name: 'like', type: 'boolean' })
  like: boolean;

  @ManyToOne(() => Posts, (post) => post.postLike)
  post: Posts;

  @ManyToOne(() => User, (user) => user.postLike)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
