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
  @PrimaryGeneratedColumn('uuid', { name: 'daily_id' })
  id: string;

  @Column({ name: 'pain_level', type: 'varchar' })
  painLevel: string;

  @Column({ name: 'collateral_effect', type: 'varchar' })
  collateralEffect: string;

  @Column({ name: 'sleep_well', type: 'boolean' })
  sleepWell: boolean;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'emotional_state', type: 'varchar' })
  emoccioanlState: string;

  @Column({ name: 'hidrated_today', type: 'boolean' })
  hidratedToday: boolean;

  @Column({ name: 'feed_today', type: 'boolean' })
  feedToday: boolean;

  @Column({ name: 'exercices_today', type: 'boolean' })
  exercicesToday: boolean;

  @Column({ name: 'tired_level_today', type: 'varchar' })
  tiredLevelToday: string;

  @ManyToOne(() => User, (users) => users.daily)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
