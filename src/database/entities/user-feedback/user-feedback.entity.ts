import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('UserFeedback')
export class UserFeedback {
  @PrimaryGeneratedColumn('uuid', { name: 'user_feedback_id' })
  id: string;

  @Column({ name: 'avaliation', type: 'int' })
  avaliation: number;

  @Column({ name: 'comment', type: 'text' })
  comment: number;

  @CreateDateColumn({ name: 'date_sent', type: 'timestamp' })
  dateSent: Date;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
