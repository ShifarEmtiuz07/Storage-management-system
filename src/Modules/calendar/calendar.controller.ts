import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}


  
      @UseGuards(AuthGuard)
    @Get('date-filtered-files')
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
  

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalendarDto: UpdateCalendarDto) {
    return this.calendarService.update(+id, updateCalendarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarService.remove(+id);
  }
}
