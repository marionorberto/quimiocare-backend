import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collateral_effet')
export class CollateralEffect {
  @PrimaryGeneratedColumn('uuid', { name: 'following_id' })
  id: string;

  @Column({ name: '', type: 'varchar' })
  description: string;

  // @ManyToOne(() => User, (users) => {})
  // user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
