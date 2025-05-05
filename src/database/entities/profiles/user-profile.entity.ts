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

  @Column({ name: 'sex', type: 'char' })
  sex: string;

  @Column({ name: 'bio', type: 'text' })
  bio: string;

  @Column({ name: 'country_name', type: 'varchar' })
  countryName: string;

  @Column({ name: 'job', type: 'varchar' })
  job: string;

  @Column({ name: 'url_img', type: 'varchar' })
  urlImg: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ name: 'address', type: 'varchar' })
  address: string;

  @ManyToMany(() => Tags, { cascade: true, eager: true })
  @JoinTable()
  tags: Tags[];

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
