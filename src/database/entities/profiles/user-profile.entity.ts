import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Tags } from '../tags/tags.entity';
import { User } from '../users/user.entity';

@Entity('User_Profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid', { name: 'user_profile_id' })
  id: string;

  @Column({ name: 'birthday', type: 'date' })
  birthday: Date;

  @Column({ name: 'bio', type: 'text' })
  bio: string;

  @Column({ name: 'weight', type: 'float'})
  weight: number;

  @Column({ name: 'height', type: 'float'})
  height: number;

  @Column({ name: 'url_img', type: 'varchar' })
  urlImg: string;

  @ManyToMany(() => Tags, { cascade: true, eager: true })
  @JoinTable()
  tags: Tags[];

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
