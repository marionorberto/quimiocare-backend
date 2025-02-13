import { PrimaryGeneratedColumn } from "typeorm";

// @Entity('Symptoms')
export class Symptom {
  @PrimaryGeneratedColumn('uuid', { name: 'symptom_id' })
  id: string;

  // @Column()

}