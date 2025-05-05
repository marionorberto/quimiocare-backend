import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('collateral_effet')
export class CollateralEffect {
  @PrimaryGeneratedColumn('uuid', { name: 'collateral_effect_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar' })
  description: string;

  @ManyToOne(() => User, (users) => users.collateralEffect)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
