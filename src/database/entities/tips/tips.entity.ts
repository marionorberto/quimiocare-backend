import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TipsCategory } from '../tips_category/tips_category.entity';
@Entity('tips')
export class Tips {
  @PrimaryGeneratedColumn('uuid', { name: 'tip_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', unique: true })
  description: string;

  @ManyToOne(() => TipsCategory, (category) => category.tip)
  category: TipsCategory;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
