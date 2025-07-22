import { Exclude } from 'class-transformer';
import { Files } from 'src/Modules/files-upload/entities/files-upload.entity';
import { Folder } from 'src/Modules/folders/entities/folder.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({unique: true})
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password_hash: string;

  @Column({ default: 0 })
  storage_used: number;

  @Column({ default: 15 })
  total_storage: number;

  @Column({ nullable: true })
  pin_code: string;

  @Column({ nullable: true })
  userImage: string;

  @Column({ unique: true,nullable:true })
  googleId: string;

  @Column({ nullable: true,type:'boolean' })
   termsConditions?: boolean;

    @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

 @OneToMany(()=>Folder,(folder)=>folder.user,{ cascade: true, onDelete: 'CASCADE' })
 folders:Folder[]

  @OneToMany(()=>Files,(files)=>files.user,{ cascade: true, onDelete: 'CASCADE' })
 files:Files[]



}
