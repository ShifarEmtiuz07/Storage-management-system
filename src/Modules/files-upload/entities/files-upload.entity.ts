import { IsString } from "class-validator";
import { Folder } from "src/Modules/folders/entities/folder.entity";
import { User } from "src/Modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Files {

@PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({nullable:true})
   path: string;
 
  @Column({type:'bigint',nullable:true})
  size: number; 

  @Column({type:'boolean', default:false})
  isPrivate:boolean

    @Column({type:'boolean', default:false})
    isFavorite:boolean

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

  @ManyToOne(() => Folder, (folder) => folder.files, { onDelete: 'CASCADE' })
  folder: Folder;

  @ManyToOne(()=>User,(user)=>user.files,{ onDelete: 'CASCADE' })
    user:User;
}