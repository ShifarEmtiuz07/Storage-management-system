import { Module } from '@nestjs/common';
import { FilesUploadService } from './files-upload.service';
import { FilesUploadController } from './files-upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './entities/files-upload.entity';
import { Folder } from '../folders/entities/folder.entity';
import { User } from '../users/entities/user.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Files,Folder,User])],
  controllers: [FilesUploadController],
  providers: [FilesUploadService],
   exports: [FilesUploadService],
})
export class FilesUploadModule {}
