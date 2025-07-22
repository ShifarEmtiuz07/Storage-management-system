import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from '../files-upload/entities/files-upload.entity';
import { Folder } from '../folders/entities/folder.entity';
import { User } from '../users/entities/user.entity';

@Module({
     imports: [TypeOrmModule.forFeature([User,Files,Folder])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
