import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('alerts')
export class Alerts {
  @PrimaryGeneratedColumn('uuid', { name: 'alert_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @Column({ name: 'content', type: 'varchar', nullable: false })
  content: string;

  @Column({ name: 'status', type: 'varchar', nullable: false })
  status: string;

  @Column({ name: 'sender', type: 'varchar', default: 'quimiocare' })
  sender: string;

  @Column({ name: 'dismiss', type: 'boolean', default: false })
  dismiss: boolean;

  @ManyToOne(() => User, (users) => users.alert)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
