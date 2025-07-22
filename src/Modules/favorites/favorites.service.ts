import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Repository } from 'typeorm';
import { Files } from '../files/entities/files-upload.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FavoritesService {

  
  constructor(
    @InjectRepository(Folder)
  private folderRepo: Repository<Folder>,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }



  async makeFavorite(fileId: number, userId) {
    try {

      const file = await this.fileRepo.findOne({ where: { id: fileId, user: { id: userId } } });
      if (!file) {
        throw new NotFoundException('File not found');
      }

      file.isFavorite = true;

      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 200,
        message: 'Make the file favorite successfully',
        data: savedFile

      };
    } catch (error) {
      throw new InternalServerErrorException('Make a file favorite error:' + error.message);
    }

  }



  async makeUnFavorite(fileId: number, userId) {
    try {

      const file = await this.fileRepo.findOne({ where: { id: fileId, user: { id: userId } } });
      if (!file) {
        throw new NotFoundException('File not found');
      }

      file.isFavorite = false;

      const savedFile = await this.fileRepo.save(file);
      return {
        statusCode: 200,
        message: 'Make the file favorite successfully',
        data: savedFile

      };
    } catch (error) {
      throw new InternalServerErrorException('Make a file favorite error:' + error.message);
    }

  }



  async findFavoriteFiles(searchTerm, userId) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // const files = await this.fileRepo.find({ where: { user: { id: userId }, isFavorite: true } });
      const qb = await this.fileRepo.createQueryBuilder('files')
        .select('files.id', 'id')
        .addSelect('files.name', 'name')
        .addSelect('files.created_at', 'created_at')
        .leftJoin('files.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('files.isFavorite = :status', { status: true });


      if (searchTerm) {
        qb.andWhere('files.name =:searchTerm', { searchTerm })
      }

      const files = await qb.getRawMany();
      return {
        statusCode: 200,
        message: 'Favorite files retrieved successfully',
        data: files
      };

    } catch (error) {
      throw new InternalServerErrorException('Favorite files retrieved error: ' + error.message);
    }
  }


}
