import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('Cancer_Types')
export class CancerType {
  @PrimaryGeneratedColumn('uuid', { name: 'cancer_types_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', unique: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
