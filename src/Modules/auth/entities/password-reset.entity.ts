import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column({ default: false ,type:'boolean'})
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;  
}
