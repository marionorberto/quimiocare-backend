import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('my-patiets')
export class MyPatients {
  @PrimaryGeneratedColumn('uuid', { name: 'my_patient_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.doctor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  doctor: User;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  patient: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
