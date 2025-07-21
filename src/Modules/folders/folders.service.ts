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

        const user = await this.userRepo.findOne({ where: { id:  req.user.id } });
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

async  findAll() {
    try{
      const folders =await this.folderRepo.find();
      if(!folders || folders.length === 0) {
        throw new NotFoundException('No folders found');
      }
      return {
        statusCode: 200,
        message: 'Folders retrieved successfully',
        data: folders
      };
  }catch (error) {
        throw new InternalServerErrorException('Error retrieving folders: ' + error.message); 
  }
}

async  findOne(id: number) {
     try{
      const folder =await this.folderRepo.findOne({where: { id }});
      if(!folder) {
        throw new NotFoundException('No folder found');
      }
      return {
        statusCode: 200,
        message: 'Folder retrieved successfully',
        data: folder
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