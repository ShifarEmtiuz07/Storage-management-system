import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { Files } from '../files-upload/entities/files-upload.entity';

@Injectable()
export class FoldersService {

   constructor(
    @InjectRepository(Folder)
    private folderRepo: Repository<Folder>,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
  ) {}
  create(createFolderDto: CreateFolderDto) {
    try{

    const folder = this.folderRepo.create(createFolderDto);
    return this.folderRepo.save(folder);

    }catch(error){

    }
    
  }

  findAll() {
    return `This action returns all folders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} folder`;
  }

  update(id: number, updateFolderDto: UpdateFolderDto) {
    return `This action updates a #${id} folder`;
  }

  remove(id: number) {
    return `This action removes a #${id} folder`;
  }
}
