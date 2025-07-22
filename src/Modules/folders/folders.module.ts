import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Files } from '../files/entities/files-upload.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder,Files,User])],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
