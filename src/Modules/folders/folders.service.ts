import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { Files } from '../files-upload/entities/files-upload.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FoldersService {

   constructor(
    @InjectRepository(Folder)
    private folderRepo: Repository<Folder>,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
     @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
async  create(createFolderDto: CreateFolderDto,req) {
    try{

        const user = await this.userRepo.findOne({ where: { id:  req.user.sub } });
       if (!user) throw new NotFoundException('User not found');

    const folder =await this.folderRepo.create({...createFolderDto,user});
    const savedFolder=await this.folderRepo.save(folder);

     return {
          statusCode: 201,
          message: `${savedFolder.name} folder created successfully`,
          data: savedFolder
        };
      } catch (error) {
        throw new InternalServerErrorException('Folder creation error: ' + error.message);
      }
    
  }

async  findAll(searchTerm:string,req) {
    try{

       const user = await this.userRepo.findOne({ where: { id:  req.user.sub } });
       if (!user) throw new NotFoundException('User not found');

      const qb= await this.folderRepo.createQueryBuilder('folders')
                 .select('folders.id','id')
                .addSelect('folders.name','name')
                .addSelect('folders.created_at','created_at')
                .leftJoin('folders.user','user')
                .where('user.id = :userId', { userId:user.id })


                if(searchTerm){
                  qb.andWhere('folders.name =:searchTerm',{searchTerm})
                }
               
             const folders=await qb.getRawMany();

                //console.log(folders)
      
      return {
        statusCode: 200,
        message: 'Folders retrieved successfully',
        data: folders
      };
  }catch (error) {
        throw new InternalServerErrorException('Error retrieving folders: ' + error.message); 
  }
}

async  findOneFolderAllFiles(folderId: number,req) {
     try{
      //console.log(folderId);  
       const user = await this.userRepo.findOne({ where: { id: req.user.sub } });
       console.log(user);
    if (!user) throw new NotFoundException('User not found');



      const folders = await this.folderRepo
    .createQueryBuilder('folder')
    .leftJoin('folder.files', 'files')
    .leftJoin('folder.user', 'user')
    .select('files.name', 'fileName')
    .addSelect('files.type', 'type')
    .addSelect('files.path', 'path') 
    
    .addSelect('files.isFavorite', 'isFavorite')    
    .addSelect('files.created_at', 'created_at') 
    .where('user.id = :userId', { userId:user.id })
    .andWhere('folder.id = :folderId', { folderId })
    .getRawMany();


      if (!folders || folders.length === 0) {
        throw new NotFoundException('No folder found with the given ID');
      }

      return {
        statusCode: 200,
        message: 'Files are retrieved successfully',
        data: folders
      };
  }catch (error) {
        throw new InternalServerErrorException('Error retrieving folder: ' + error.message); 
  }
  }

 async update(id: number, updateFolderDto: UpdateFolderDto) {

    try{
      const folder =await this.folderRepo.findOne({where: { id }});
      if(!folder) {
        throw new NotFoundException('No folder found');
      }

      Object.assign(folder, updateFolderDto);
      return {
        statusCode: 200,
        message: 'Folder updated successfully',
        data: folder
      };
  }catch (error) {
        throw new InternalServerErrorException('Error updating folder: ' + error.message); 
  }
  }

async  remove(id: number) {


    try{
      const folder =await this.folderRepo.findOne({where: { id }});
      if(!folder) {
        throw new NotFoundException('No folder found');
      }

      await this.folderRepo.remove(folder);
      return {
        statusCode: 200,
        message: 'Folder deleted successfully',
       
      };
    } catch (error) {
        throw new InternalServerErrorException('Error deleting folder: ' + error.message); 
    }
  }
}