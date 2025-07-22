import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from '../files/entities/files-upload.entity';
import { Folder } from '../folders/entities/folder.entity';
import { User } from '../users/entities/user.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Files,Folder,User])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
