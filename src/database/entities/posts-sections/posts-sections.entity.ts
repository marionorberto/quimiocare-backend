import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../posts/posts.entity';
import { PostsContents } from '../posts-contents/posts-contents.entity';

@Entity('Post_Sections')
export class PostsSections {
  constructor() {}
  @PrimaryGeneratedColumn('uuid', { name: 'post_section_id' })
  postsSectionsId: string;

  @Column({ name: 'subtitle', type: 'varchar', length: '200' })
  subtitle: string;

  @Column({ name: 'section_order', nullable: true, type: 'int' })
  sectionOrder: number;

  @ManyToOne(() => Posts, (post) => post.sections)
  @JoinColumn()
  post: Posts;

  @Column({ name: 'link_file_section', type: 'text' })
  linkFileSection: string;

  @OneToMany(() => PostsContents, (postContent) => postContent.sections, {
    cascade: true,
    eager: true,
  })
  contents: PostsContents[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
