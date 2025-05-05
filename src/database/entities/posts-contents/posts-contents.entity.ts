import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostsSections } from '../posts-sections/posts-sections.entity';

@Entity('Post_Contents')
export class PostsContents {
  @PrimaryGeneratedColumn('uuid', { name: 'post_content_id' })
  postsContentsId: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => PostsSections, (postSection) => postSection.contents)
  @JoinColumn()
  sections: PostsSections;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
