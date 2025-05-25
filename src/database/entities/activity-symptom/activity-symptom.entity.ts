import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Symptom } from '../symptoms/symptom.entity';
import { Activities } from '../activities/activities.entity';

@Entity('activity_symptoms')
export class ActivitySymptoms {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_symptom_id' })
  id: string;

  @ManyToOne(() => Activities, (activity) => activity.symptomActivity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activity: Activities;

  @ManyToOne(() => Symptom, (symptom) => symptom.activitySymptom)
  symptom: Symptom;

  @Column({ name: 'persist', type: 'boolean', default: false })
  persisti: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
