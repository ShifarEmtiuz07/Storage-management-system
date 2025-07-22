import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('date-filtered-files')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }



  @UseGuards(AuthGuard)
  @Get()
  getRecentFiles(@Req() req,
    @Query('date') date?: string,
  ) {

    const parseDate = (dateString: string | undefined): Date | undefined => {
      if (!dateString) return undefined;
      const date = new Date(dateString);

      if (isNaN(date.getTime()))
        throw new BadRequestException(`Invalid date format: ${dateString}`);
      return date;
    };

    const parsedDate = parseDate(date);


    return this.calendarService.dateFilteredFiles(req, parsedDate);
  }

}
