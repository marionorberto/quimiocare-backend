import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('activities')
export class Activities {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_id' })
  id: string;

  @Column({ name: 'booking', type: 'varchar', nullable: true })
  booking: string;

  @Column({ name: 'medication', type: 'varchar', nullable: true })
  medication: string;

  @Column({ name: 'symptom', type: 'varchar', nullable: true })
  symptom: string;

  @ManyToOne(() => User, (user) => user.activity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
