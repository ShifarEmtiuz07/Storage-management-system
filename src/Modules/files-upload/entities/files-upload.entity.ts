import { IsString } from "class-validator";
import { Folder } from "src/Modules/folders/entities/folder.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Files {

@PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('float')
  size: number; 

  @Column({type:'boolean', default:false})
  isPrivate:boolean

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

  @ManyToOne(() => Folder, folder => folder.files, { onDelete: 'CASCADE' })
  folder: Folder;
}
