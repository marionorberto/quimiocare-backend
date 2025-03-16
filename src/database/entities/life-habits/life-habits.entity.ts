import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('User_Life_Habits')
export class UserLifeHabits {
  @PrimaryGeneratedColumn('uuid', { name: 'user_life_habit_id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', length: '40' })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
