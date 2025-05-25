import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medication } from '../medications/medication.entity';
import { Activities } from '../activities/activities.entity';

@Entity('activity_medications')
export class ActivityMedications {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_medication_id' })
  id: string;

  @ManyToOne(() => Medication, (medication) => medication.activityMedication, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  medication: Medication;

  @ManyToOne(() => Activities, (activities) => activities.medicationActivity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activity: Activities;

  @Column({ name: 'taken', type: 'boolean', default: false })
  taken: boolean;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
