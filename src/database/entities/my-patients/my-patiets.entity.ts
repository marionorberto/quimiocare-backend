import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('my_patients')
export class MyPatients {
  @PrimaryGeneratedColumn('uuid', { name: 'my_patient_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.doctor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  doctor: User;

  @ManyToOne(() => User, (user) => user.patient, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  patient: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
