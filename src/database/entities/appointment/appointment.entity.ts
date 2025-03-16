import {
  EnumAppointmentType,
  EnumAppointmentStatus,
} from 'src/modules/appointment/interfaces/interfaces';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('Appointment')
export class Appointment {
  @PrimaryGeneratedColumn('uuid', { name: 'appointment_id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'date_appointment', type: 'datetime' })
  dateAppointment: Date;

  @Column({
    name: 'type',
    type: 'enum',
    enum: EnumAppointmentType,
  })
  type: EnumAppointmentType;

  @Column({
    name: 'status_appointment',
    type: 'enum',
    enum: EnumAppointmentStatus,
    default: EnumAppointmentStatus.PENDING,
  })
  statusAppointment: EnumAppointmentStatus;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.appointment)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
