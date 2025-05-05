import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EnumSupportWishLevel } from 'src/modules/user-medical-information/interfaces/types';

@Entity('Users_Medical_Information')
export class MedicalInformation {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ name: 'stage', type: 'varchar', length: '15', nullable: true })
  stage: string;

  @Column({ name: 'bloodGroup', type: 'varchar', nullable: true })
  bloodGroup: string;

  @Column({ name: 'hospital', type: 'varchar', nullable: true })
  hospital: string;

  @Column({ name: 'height', type: 'decimal', nullable: true })
  height: number;

  @Column({ name: 'weight', type: 'decimal', nullable: true })
  weight: number;

  @Column({ name: 'codHospital', type: 'varchar', nullable: true })
  codHospital: string;

  @Column({ name: 'target_support', type: 'enum', enum: EnumSupportWishLevel })
  targetSupport: EnumSupportWishLevel;

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
