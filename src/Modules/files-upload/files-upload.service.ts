import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilesUploadDto } from './dto/create-files-upload.dto';
import { UpdateFilesUploadDto } from './dto/update-files-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Repository } from 'typeorm';
import { Files } from './entities/files-upload.entity';
import * as fs from 'fs-extra';
import { User } from '../users/entities/user.entity';
import { bytesToGB } from 'src/utils/storage.helper';


@Injectable()
export class FilesUploadService {

   private readonly MAX_STORAGE = 15; // GB
   constructor( @InjectRepository(Folder)
      private folderRepo: Repository<Folder>,
      @InjectRepository(Files)
      private fileRepo: Repository<Files>,
       @InjectRepository(User)
      private userRepo: Repository<User>,
    ){}

  async importImage(
  name,
  sizeInBytes,
    path,
  folderId,
  type,
  userId) {
    try{

    const folder = await this.folderRepo.findOne({ where: { id: folderId } });
    if (!folder) throw new NotFoundException('Folder not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
      const used = await this.getUsedStorage(user.id);
      console.log(used.usedGB)
    //const sizeInMB = sizeInBytes / (1024 * 1024);
   // console.log(`Used storage: ${used} MB, File size: ${sizeInMB} MB`);
    const newTotal = used.usedGB + bytesToGB(sizeInBytes);

     if (newTotal > this.MAX_STORAGE) {
    fs.unlinkSync(path); 
    throw new Error('Not enough storage space');
  }

    const file = this.fileRepo.create({
    name,
    size:sizeInBytes,                        //size: parseFloat(sizeInMB.toFixed(2)), // store size as float
    type,
    path,
    folder,
    user
  });

   const savedFile= this.fileRepo.save(file);
   
      return {
        statusCode: 201,
        message: 'Image imported successfully',
        data: savedFile
      };


    }catch (error) {
     
      throw new Error('Failed to import image: '+error.message);
    }

  }



  async importPdf(
  name,
  sizeInBytes,
    path,
  folderId,
  type,
  userId) {
    try{

    const folder = await this.folderRepo.findOne({ where: { id: folderId } });
    if (!folder) throw new NotFoundException('Folder not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
      const used = await this.getUsedStorage(user.id);
    //const sizeInMB = sizeInBytes / (1024 * 1024);
   // console.log(`Used storage: ${used} MB, File size: ${sizeInMB} MB`);
    const newTotal = used.usedGB + bytesToGB(sizeInBytes);

     if (newTotal > this.MAX_STORAGE) {
    fs.unlinkSync(path); 
    throw new Error('Not enough storage space');
  }

    const file = this.fileRepo.create({
    name,
    size: sizeInBytes, // store size as float
    type,
    path,
    folder,
    user
  });

   const savedFile= this.fileRepo.save(file);

    return {
        statusCode: 201,
        message: 'Pdf imported successfully',
        data: savedFile
      };


    }catch (error) {
     
      throw new Error('Failed to import pdf: '+error.message);
    }

  }


  async importNote(
  name,
  sizeInBytes,
    path,
  folderId,
  type,
  userId) {
    try{

    const folder = await this.folderRepo.findOne({ where: { id: folderId } });
    if (!folder) throw new NotFoundException('Folder not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
      const used = await this.getUsedStorage(user.id);
    // const sizeInMB = sizeInBytes / (1024 * 1024);
    //console.log(`Used storage: ${used} MB, File size: ${sizeInMB} MB`);
    const newTotal = used.usedGB + bytesToGB(sizeInBytes);

     if (newTotal > this.MAX_STORAGE) {
    fs.unlinkSync(path); 
    throw new Error('Not enough storage space');
  }
    const file = this.fileRepo.create({
    name,
    size:sizeInBytes,  // store size as float
    type,
    path,
    folder,
    user
  });

   const savedFile= this.fileRepo.save(file);
    return {
        statusCode: 201,
        message: 'Note imported successfully',
        data: savedFile
      };


    }catch (error) {
     
      throw new Error('Failed to add note: '+error.message);
    }

  }

  



  async getUsedStorage(id) {
  const MAX_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB in bytes

  const files = await this.fileRepo.find({where:{user:{id:id}}}); // Assuming user ID is 1 for this example
  // const totalSizeInMB = files.reduce((sum, file) => sum + file.size, 0);
  // return totalSizeInMB; // size in MB

  const totalUsedBytes = files.reduce((sum, f) => sum + Number(f.size), 0);
  const remainingBytes = MAX_BYTES - totalUsedBytes;
  //console.log(Number((bytesToGB(totalUsedBytes)).toFixed(2)))
   return {
    totalStorageGB: 15,
    usedGB: Number((bytesToGB(totalUsedBytes)).toFixed(2)),
    availableGB: Number((bytesToGB(remainingBytes)).toFixed(2)),
  };
}

  create(createFilesUploadDto: CreateFilesUploadDto) {
    return 'This action adds a new filesUpload';
  }

  findAll() {
    return `This action returns all filesUpload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} filesUpload`;
  }

  update(id: number, updateFilesUploadDto: UpdateFilesUploadDto) {
    return `This action updates a #${id} filesUpload`;
  }

  remove(id: number) {
    return `This action removes a #${id} filesUpload`;
  }
}