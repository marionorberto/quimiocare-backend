import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activities } from '../activities/activities.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity('activity_appointments')
export class ActivityAppointments {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_appointment_id' })
  id: string;

  @ManyToOne(() => Appointment, (m) => m.activityAppointment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  appointment: Appointment;

  @ManyToOne(() => Activities, (activity) => activity.appointmentsActivity)
  activity: Activities;

  @Column({ name: 'taken', type: 'boolean', default: false })
  taken: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
