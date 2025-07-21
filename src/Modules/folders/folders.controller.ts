import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

   @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFolderDto: CreateFolderDto,@Req() req) {
    
    return this.foldersService.create(createFolderDto,req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query('searchTerm') searchTerm:string,@Req() req) {
    return this.foldersService.findAll(searchTerm,req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Req() req) {
    return this.foldersService.findOneFolderAllFiles(+id,req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.foldersService.update(+id, updateFolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foldersService.remove(+id);
  }
}