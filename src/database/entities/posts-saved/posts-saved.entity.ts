import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  Column,
} from 'typeorm';
import { Posts } from '../posts/posts.entity';
import { User } from '../users/user.entity';

@Entity('Post_Saved')
export class PostSaved {
  @PrimaryGeneratedColumn('uuid', { name: 'post_saved_id' })
  postSaveId: string;

  @Column({ name: 'saved', type: 'boolean' })
  saved: boolean;

  @ManyToOne(() => Posts, (post) => post.postLike)
  post: Posts;

  @ManyToOne(() => User, (user) => user.postLike)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
