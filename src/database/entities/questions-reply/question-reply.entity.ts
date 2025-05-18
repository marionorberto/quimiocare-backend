import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Questions } from '../questions/question.entity';

@Entity('questions_replies')
export class QuestionReply {
  @PrimaryGeneratedColumn('uuid', { name: 'question_replies_id' })
  id: string;

  @Column({ name: 'reply', type: 'text' })
  reply: string;

  @ManyToOne(() => User, (users) => users.question)
  user: User;

  @ManyToOne(() => Questions, (question) => question.reply)
  question: Questions;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
