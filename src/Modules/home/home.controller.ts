import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  create(@Body() createHomeDto: CreateHomeDto) {
    return this.homeService.create(createHomeDto);
  }

  
  @UseGuards(AuthGuard)
  @Get('profile-storage')
  storageProfile(@Req() req) {
    return this.homeService.storageProfile(req);
  }
  @UseGuards(AuthGuard)
  @Get('folders/stats')
 getFoldersWithItems(@Req() req) {
  return this.homeService.getFoldersWithItems(req);
}

  @UseGuards(AuthGuard)
  @Get('recent-files')
 getRecentFiles(@Req() req) {
  return this.homeService.getRecentFiles(req);
}

 

  @Get()
  findAll() {
    return this.homeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
    return this.homeService.update(+id, updateHomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeService.remove(+id);
  }
}
