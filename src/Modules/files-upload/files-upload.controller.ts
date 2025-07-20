import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FilesUploadService } from './files-upload.service';
import { CreateFilesUploadDto } from './dto/create-files-upload.dto';
import { UpdateFilesUploadDto } from './dto/update-files-upload.dto';

@Controller('files-upload')
export class FilesUploadController {
  constructor(private readonly filesUploadService: FilesUploadService) {}

  @Post()
  create(@Body() createFilesUploadDto: CreateFilesUploadDto) {
    return this.filesUploadService.create(createFilesUploadDto);
  }

  @Get()
  findAll() {
    return this.filesUploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesUploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilesUploadDto: UpdateFilesUploadDto) {
    return this.filesUploadService.update(+id, updateFilesUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesUploadService.remove(+id);
  }
}
