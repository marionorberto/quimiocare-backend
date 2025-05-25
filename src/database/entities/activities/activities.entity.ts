import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ActivitySymptoms } from '../activity-symptom/activity-symptom.entity';
import { ActivityMedications } from '../activity-medication/activity-medication.entity';
import { ActivityAppointments } from '../activity-appointment/activity-appointment.entity';

@Entity('activities')
export class Activities {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_id' })
  id: string;

  @Column({ name: 'date_realization', type: 'datetime' })
  dateRealization: Date;

  @ManyToOne(() => User, (user) => user.activity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => ActivitySymptoms, (rs) => rs.activity)
  symptomActivity: ActivitySymptoms[];

  @OneToMany(() => ActivityMedications, (am) => am.activity)
  medicationActivity: ActivityMedications[];

  @OneToMany(() => ActivityAppointments, (aa) => aa.activity)
  appointmentsActivity: ActivityAppointments[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
