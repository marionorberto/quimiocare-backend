import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('Notifications')
export class Notifications {
  @PrimaryGeneratedColumn('uuid', { name: 'notification_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'subtitle', type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'img', type: 'text', nullable: true })
  img: string;

  @ManyToOne(() => User, (users) => users.notifications)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
