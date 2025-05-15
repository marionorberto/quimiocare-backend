import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('suggest_yt')
export class suggestVideo {
  @PrimaryGeneratedColumn('uuid', { name: 'suggest_yt_id' })
  id: string;

  @Column({ name: 'suggestion', type: 'text' })
  suggestion: string;

  @ManyToOne(() => User, (user) => user.suggest, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
