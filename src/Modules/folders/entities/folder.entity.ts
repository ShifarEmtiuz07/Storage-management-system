import { Files } from "src/Modules/files/entities/files-upload.entity";
import { User } from "src/Modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

 @Column({type:'float',default:0.0})
 size: number;

  @Column({default:0})
 item: number;

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



  @OneToMany(() => Files, files => files.folder)
  files: Files[];

  @ManyToOne(()=>User,(user)=>user.folders,{ onDelete: 'CASCADE' })
  user:User;

}
