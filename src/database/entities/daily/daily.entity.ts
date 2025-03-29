import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('Daily')
export class Daily {
  @PrimaryGeneratedColumn('uuid', { name: 'following_id' })
  id: string;

  @Column({ name: '', type: 'int' })
  painLevel: number;

  @Column({ name: '', type: 'varchar' })
  collateralEffect: string;

  @Column({ name: '', type: 'boolean' })
  sleepWell: boolean;

  @Column({ name: '', type: 'varchar' })
  note: string;

  @Column({ name: '', type: 'varchar' })
  emoccioanlState: string;

  @Column({ name: '', type: 'varchar' })
  hidratedToday: boolean;

  @Column({ name: '', type: 'varchar' })
  feedToday: boolean;

  @Column({ name: '', type: 'varchar' })
  exercicesToday: true;

  @Column({ name: '', type: 'varchar' })
  tiredLevelToday: string;

  @ManyToOne(() => User, (users) => users.daily)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
