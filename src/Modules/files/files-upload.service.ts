import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFilesUploadDto } from './dto/create-files-upload.dto';
import { UpdateFilesUploadDto } from './dto/update-files-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Between, In, Repository } from 'typeorm';
import { Files } from './entities/files-upload.entity';
import * as fs from 'fs-extra';
import { User } from '../users/entities/user.entity';
import { bytesToGB } from 'src/utils/storage.helper';
import { extname } from 'path';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class FilesUploadService {

  private readonly MAX_STORAGE = 15; // GB
  constructor(@InjectRepository(Folder)
  private folderRepo: Repository<Folder>,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async importImage(
    name,
    sizeInBytes,
    path,
    folderId,
    type,
    userId) {
    try {

      const folder = await this.folderRepo.findOne({ where: { id: folderId } });
      if (!folder) throw new NotFoundException('Folder not found');
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const used = await this.getUsedStorage(user.id);
      console.log(sizeInBytes)
      console.log(used.usedGB)
      //const sizeInMB = sizeInBytes / (1024 * 1024);
      // console.log(`Used storage: ${used} MB, File size: ${sizeInMB} MB`);
      const newTotal = used.usedGB + bytesToGB(sizeInBytes);

      if (newTotal > this.MAX_STORAGE) {
        fs.unlinkSync(path);
        throw new Error('Not enough storage space');
      }

      const file = await this.fileRepo.create({
        name,
        size: sizeInBytes,                        //size: parseFloat(sizeInMB.toFixed(2)), // store size as float
        type,
        path,
        folder,
        user
      });

      const savedFile = await this.fileRepo.save(file);

      return {
        statusCode: 201,
        message: 'Image imported successfully',
        data: savedFile
      };


    } catch (error) {

      throw new Error('Failed to import image: ' + error.message);
    }

  }



  async importPdf(
    name,
    sizeInBytes,
    path,
    folderId,
    type,
    userId) {
    try {

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

      const file = await this.fileRepo.create({
        name,
        size: sizeInBytes, // store size as float
        type,
        path,
        folder,
        user
      });

      const savedFile = await this.fileRepo.save(file);

      return {
        statusCode: 201,
        message: 'Pdf imported successfully',
        data: savedFile
      };


    } catch (error) {

      throw new Error('Failed to import pdf: ' + error.message);
    }

  }


  async importNote(
    name,
    sizeInBytes,
    path,
    folderId,
    type,
    userId) {
    try {

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
      const file = await this.fileRepo.create({
        name,
        size: sizeInBytes,  // store size as float
        type,
        path,
        folder,
        user
      });

      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 201,
        message: 'Note imported successfully',
        data: savedFile
      };


    } catch (error) {

      throw new Error('Failed to add note: ' + error.message);
    }

  }





  async getUsedStorage(id) {
    const MAX_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB in bytes

    const files = await this.fileRepo.find({ where: { user: { id: id } } }); 

    const totalUsedBytes = files.reduce((sum, f) => sum + Number(f.size), 0);
    const remainingBytes = MAX_BYTES - totalUsedBytes;

    return {
      totalStorageGB: 15,
      usedGB: Number((bytesToGB(totalUsedBytes)).toFixed(4)),
      availableGB: Number((bytesToGB(remainingBytes)).toFixed(4)),
    };
  }


  async renameFile(fileId: number, newName: string) {
    try {

      const file = await this.fileRepo.findOne({ where: { id: fileId } });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      
      const newFileName = newName + file.type;
      const oldPath = file.path;
      const newPath = oldPath.replace(file.name, newFileName);

      console.log(`Renaming file from ${oldPath} to ${newPath}`);

     
      fs.renameSync(oldPath, newPath);

    
      file.name = newFileName;
      file.path = newPath;
      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 200,
        message: 'Rename successful',
        data: savedFile

      };

    } catch (error) {
      throw new InternalServerErrorException('Rename error: ' + error.message)
    }

  }

  async copyFileToFolder(fileId: number, targetFolderId: number) {
    try {
      const file = await this.fileRepo.findOne({ where: { id: fileId }, relations: ['folder'] });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      const targetFolder = await this.folderRepo.findOne({ where: { id: targetFolderId } });
      if (!targetFolder) {
        throw new NotFoundException('Target folder not found');
      }

      file.folder = targetFolder;
      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 201,
        message: 'Make a copy of file successfully',
        data: savedFile

      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to move file: ' + error.message);
    }

  }


  async duplicateFile(fileId: number) {
    try {
      const file = await this.fileRepo.findOne({ where: { id: fileId }, relations: ['folder', 'user'] });
      if (!file) {
        throw new NotFoundException('File not found');
      }

      const ext = path.extname(file.name);
      const base = path.basename(file.name, ext);
      const newName = `${base}_copy${ext}`;
      const newPath = file.path.replace(file.name, newName);

 
      fs.copyFileSync(file.path, newPath);

   
      const duplicated = this.fileRepo.create({
        name: newName,
        type: file.type,
        size: file.size,
        path: newPath,
        user: file.user,
        folder: file.folder,
      });

      const savedFile = await this.fileRepo.save(duplicated);
      return {
        statusCode: 201,
        message: 'Make a duplicate file successfully',
        data: savedFile

      };
    } catch (error) {
      throw new InternalServerErrorException('File duplicate failed: ' + error.message)
    }
  }


  async findAllPdfs(searchTerm, req) {

    try {

      const allowedTypes = [
        '.pdf'
      ];
      const user = await this.userRepo.findOne({ where: { id: req.user.sub } });
      if (!user) throw new NotFoundException('User not found');


      const qb = await this.fileRepo.createQueryBuilder('files')
        .select('files.id', 'id')
        .addSelect('files.name', 'name')
        .addSelect('files.created_at', 'created_at')
        .leftJoin('files.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('files.type IN (:...allowedTypes)', { allowedTypes })
        .andWhere('files.isPrivate = :status', { status: false });


      if (searchTerm) {
        qb.andWhere('files.name =:searchTerm', { searchTerm })
      }

      const notes = await qb.getRawMany();


      return {
        statusCode: 200,
        message: 'Pdfs retrieved successfully',
        data: notes
      };


    } catch (error) {
      throw new InternalServerErrorException("Pdfs retrieved error: " + error.message)
    }

  }


  async findAllImages(searchTerm, req) {

    try {

      const allowedTypes = [
        '.jpeg',
        '.jpg',
        '.png',
        '.gif',
        '.bmp',
        '.webp'
      ];
      console.log(req.user.sub);
      const user = await this.userRepo.findOne({ where: { id: req.user.sub } });
      if (!user) throw new NotFoundException('User not found');
      //console.log(user);


      const qb = await this.fileRepo.createQueryBuilder('files')
        .select('files.id', 'id')
        .addSelect('files.name', 'name')
        .addSelect('files.created_at', 'created_at')
        .leftJoin('files.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('files.type IN (:...allowedTypes)', { allowedTypes })
        .andWhere('files.isPrivate = :status', { status: false });


      if (searchTerm) {
        qb.andWhere('files.name =:searchTerm', { searchTerm })
      }

      const images = await qb.getRawMany();
      // console.log(images);


      return {
        statusCode: 200,
        message: 'Images retrieved successfully',
        data: images
      };


    } catch (error) {
      throw new InternalServerErrorException("Images retrieved error: " + error.message)
    }

  }



  async findAllNotes(searchTerm, req) {

    try {

      const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', '.docx', '.doc'
      ];
      const user = await this.userRepo.findOne({ where: { id: req.user.sub } });
      if (!user) throw new NotFoundException('User not found');


      const qb = await this.fileRepo.createQueryBuilder('files')
        .select('files.id', 'id')
        .addSelect('files.name', 'name')
        .addSelect('files.created_at', 'created_at')
        .leftJoin('files.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('files.type IN (:...allowedTypes)', { allowedTypes })
        .andWhere('files.isPrivate = :status', { status: false });


      if (searchTerm) {
        qb.andWhere('files.name =:searchTerm', { searchTerm })
      }

      const notes = await qb.getRawMany();


      return {
        statusCode: 200,
        message: 'Notes retrieved successfully',
        data: notes
      };


    } catch (error) {
      throw new InternalServerErrorException("All notes retrieved error: " + error.message)
    }

  }


  findOne(id: number) {
    return `This action returns a #${id} filesUpload`;
  }

  update(id: number, updateFilesUploadDto: UpdateFilesUploadDto) {
    return `This action updates a #${id} filesUpload`;
  }

  async makeFilePrivate(fileId, pin, userId) {
    try {
      const file = await this.fileRepo.findOne({ where: { id: fileId } });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const isValid = await bcrypt.compare(pin, user.pin_code);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      file.isPrivate = true;
      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 200,
        message: 'File made private successfully',
        data: savedFile
      };


    } catch (error) {
      throw new InternalServerErrorException('Make file private error: ' + error.message);
    }
  }


  async findPrivateFiles(pin, userId) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const isValid = await bcrypt.compare(pin, user.pin_code);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const files = await this.fileRepo.find({ where: { user: { id: userId }, isPrivate: true } });
      return {
        statusCode: 200,
        message: 'Private files retrieved successfully',
        data: files
      };

    } catch (error) {
      throw new InternalServerErrorException('Find private files error: ' + error.message);
    }
  }

  async remove(id: number) {

    try {
      const file = await this.fileRepo.findOne({ where: { id: id } });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      await this.fileRepo.remove(file);
      fs.unlinkSync(file.path);
      return {
        statusCode: 200,
        message: 'File deleted successfully',

      };
    }
    catch (error) {
      throw new InternalServerErrorException("File deletion failed: " + error.message);
    }

  }


}