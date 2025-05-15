import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('Posts')
export class Posts {
  @PrimaryGeneratedColumn('uuid', { name: 'post_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'subtitle', type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'img', type: 'text', nullable: true })
  img: string;

  @Column({ name: 'tag', type: 'varchar', nullable: true })
  tag: string;

  @ManyToOne(() => User, (users) => users.post)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
