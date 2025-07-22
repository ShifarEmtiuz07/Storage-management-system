import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Files } from '../files/entities/files-upload.entity';
import { User } from '../users/entities/user.entity';
import { FilesUploadModule } from '../files/files-upload.module';

@Module({
  imports:[TypeOrmModule.forFeature([Folder,Files,User]),FilesUploadModule],

  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
