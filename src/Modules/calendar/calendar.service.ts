import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { User } from '../users/entities/user.entity';
import { Between, In, Repository } from 'typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Files } from '../files-upload/entities/files-upload.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CalendarService {




  constructor(@InjectRepository(Folder)
  private folderRepo: Repository<Folder>,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }





      async dateFilteredFiles(req, parsedDate ?: Date,) {

      try {
        const user = await this.userRepo.findOne({ where: { id: req.user.sub } });
        if (!user) throw new NotFoundException('User not found');

        let dateWhereClause = {};

        if (parsedDate) {
          const startOfDay = new Date(parsedDate);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(parsedDate);
          endOfDay.setHours(23, 59, 59, 999);
          dateWhereClause = { created_at: Between(startOfDay, endOfDay) };
        }

        const qb = await this.fileRepo.createQueryBuilder('files')
          .select('files.id', 'id')
          .addSelect('files.name', 'name')
          .addSelect('files.created_at', 'created_at')
          .leftJoin('files.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .andWhere('files.isPrivate = :status', { status: false })
          .andWhere(dateWhereClause)
          .getRawMany();

        return {
          statusCode: 200,
          message: 'Files retrieved successfully within the date range',
          data: qb
        };

      } catch (error) {
        throw new InternalServerErrorException('Recent files retrieve error: ' + error.message)
      }
    }











  create(createCalendarDto: CreateCalendarDto) {



    return 'This action adds a new calendar';
  }

  findAll() {
    return `This action returns all calendar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calendar`;
  }

  update(id: number, updateCalendarDto: UpdateCalendarDto) {
    return `This action updates a #${id} calendar`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendar`;
  }
}
