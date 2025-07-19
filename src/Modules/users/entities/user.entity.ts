import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')

export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 0 })
  storage_used: number;

  @Column({ nullable: true })
  pin_code: string;
}
