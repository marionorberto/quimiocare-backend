import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('profile_doctor')
export class ProfileDoctor {
  @PrimaryGeneratedColumn('uuid', { name: 'profile_doctor_id' })
  id: string;
  @Column({ name: 'sex', type: 'char' })
  sex: string;

  @Column({ name: 'bio', type: 'text' })
  bio: string;

  @Column({ name: 'job', type: 'varchar' })
  job: string;

  @Column({ name: 'url_img', type: 'varchar' })
  urlImg: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ name: 'address', type: 'varchar' })
  address: string;

  hospital: string;

  @Column({ name: 'speciality', type: 'varchar' })
  speciality: string;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
