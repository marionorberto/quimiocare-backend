import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Posts } from '../posts/posts.entity';
import { Exclude } from 'class-transformer';
import { Notifications } from '../notifications/notifications.entity';
import { PostComments } from '../posts-comments/posts-comments.entity';
import { PostLikes } from '../posts-likes/posts-likes.entity';
import { PostSaved } from '../posts-saved/posts-saved.entity';
import { Tags } from '../tags/tags.entity';
import { Symptom } from '../symptoms/symptom.entity';
import { Medication } from '../medications/medication.entity';
import { Appointment } from '../appointment/appointment.entity';
import { EnumTypeUser } from 'src/modules/users/interfaces/interfaces';
import { Daily } from '../daily/daily.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ name: 'username', type: 'varchar', length: '40', unique: true })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: '40', unique: true })
  email: string;

  @Column({
    name: 'type_user',
    type: 'enum',
    enum: EnumTypeUser,
    default: EnumTypeUser.paciente,
  })
  typeUser: EnumTypeUser;

  @Column({ name: 'password_hash', type: 'text' })
  @Exclude()
  password: string;

  @OneToMany(() => Posts, (post) => post.user, {
    cascade: true,
  })
  post: Posts[];

  @OneToMany(() => PostLikes, (like) => like.post, { cascade: true })
  postLike: PostLikes[];

  @OneToMany(() => Notifications, (notification) => notification.user, {
    cascade: true,
    eager: true,
  })
  notifications: Notifications[];

  @OneToMany(() => PostComments, (comment) => comment.user, {
    cascade: true,
  })
  comments: PostComments[];

  @Column({ name: 'reset_password_token', type: 'text', nullable: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @OneToMany(() => PostSaved, (saved) => saved.user, {
    cascade: true,
  })
  saves: PostSaved[];

  @ManyToMany(() => Tags, { cascade: true, eager: true })
  @JoinTable()
  tags: Tags[];

  @OneToMany(() => Symptom, (symptoms) => symptoms.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  symptoms: Symptom[];

  @OneToMany(() => Medication, (medication) => medication.user, {
    cascade: true,
  })
  medication: Medication[];

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    cascade: true,
  })
  appointment: Appointment[];

  @OneToMany(() => Daily, (daily) => daily.user, { cascade: true })
  daily: Daily[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }
  }
}
