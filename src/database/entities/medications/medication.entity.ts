import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ActivityMedications } from '../activity-medication/activity-medication.entity';

@Entity('Medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid', { name: 'medication_id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'dosage', type: 'varchar' })
  dosage: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'time_reminder', type: 'time' })
  timeReminder: Date;

  @ManyToOne(() => User, (user) => user.medication, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => ActivityMedications, (activity) => activity.medication, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activityMedication: ActivityMedications[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
