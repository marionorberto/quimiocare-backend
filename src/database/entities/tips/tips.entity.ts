import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TipsCategory } from '../tips_category/tips_category.entity';
import { User } from '../users/user.entity';
@Entity('tips')
export class Tips {
  @PrimaryGeneratedColumn('uuid', { name: 'tip_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', unique: false })
  description: string;

  @ManyToOne(() => TipsCategory, (category) => category.tip)
  category: TipsCategory;

  @ManyToOne(() => User, (user) => user.tip)
  userDoctor: User;

  @Column({ name: 'active', type: 'boolean', default: false })
  active: boolean;

  @Column({ name: 'reject', type: 'boolean', default: false })
  reject: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
