import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { QuestionReply } from '../questions-reply/question-reply.entity';

@Entity('questions')
export class Questions {
  @PrimaryGeneratedColumn('uuid', { name: 'question_id' })
  id: string;

  @Column({ name: 'question', type: 'text' })
  question: string;

  @ManyToOne(() => User, (users) => users.question)
  user: User;

  @OneToMany(() => QuestionReply, (reply) => reply.question)
  reply: QuestionReply[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
