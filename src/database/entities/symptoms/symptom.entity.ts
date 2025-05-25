import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EnumSymptomSeverity } from 'src/modules/symptoms/interfaces/types';
import { ActivitySymptoms } from '../activity-symptom/activity-symptom.entity';

@Entity('Symptoms')
export class Symptom {
  @PrimaryGeneratedColumn('uuid', { name: 'symptom_id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar' })
  description: string;

  @Column({ name: 'severity', type: 'enum', enum: EnumSymptomSeverity })
  severity: EnumSymptomSeverity;

  @ManyToOne(() => User, (user) => user.symptoms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => ActivitySymptoms, (as) => as.symptom)
  activitySymptom: ActivitySymptoms[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
