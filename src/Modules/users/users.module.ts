import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Folder } from '../folders/entities/folder.entity';
import { Files } from '../files-upload/entities/files-upload.entity';


@Module({
  imports:[TypeOrmModule.forFeature([User,Folder,Files])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
