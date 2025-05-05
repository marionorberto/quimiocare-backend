import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('TagUsers')
export class Tags {
  @PrimaryGeneratedColumn('uuid', { name: 'tag_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', unique: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
