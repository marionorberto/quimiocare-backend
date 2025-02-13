import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Followers')
export class Followers {
  @PrimaryGeneratedColumn('uuid', { name: 'following_id' })
  id: string;

  @Column({ name: 'follower', type: 'uuid' })
  follower: string;

  @Column({ name: 'followed', type: 'uuid' })
  followed: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
