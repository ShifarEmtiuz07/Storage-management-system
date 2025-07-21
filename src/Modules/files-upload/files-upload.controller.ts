import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Req, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesUploadService } from './files-upload.service';
import { CreateFilesUploadDto } from './dto/create-files-upload.dto';
import { UpdateFilesUploadDto } from './dto/update-files-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';

@Controller('files-upload')
export class FilesUploadController {
  constructor(private readonly filesUploadService: FilesUploadService) {}


  @UseGuards(AuthGuard)
  @Post('import-image/:id')
  @UseInterceptors(FileInterceptor('image'))
 async importImage(@Param('id') folderId: string,@UploadedFile( new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^image\/(jpeg|jpg|png|gif|bmp|webp)$/i
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) file: Express.Multer.File,@Req() req) {
     
   if (!file) throw new BadRequestException('Image not found');
  let image;
      
        const ext = extname(file.originalname);
        const baseName= file.originalname.replace(ext, '');
        const fileName = baseName+`${Date.now()}`+ext;
        
        const filePath = `./uploads/images/${fileName}`;
        await fs.writeFile(filePath, file.buffer);
         image = fileName;
      
    console.log( file.size);
  
  return this.filesUploadService.importImage(
       fileName,
       file.size,
       filePath,
      folderId,
       ext,
       req.user.id 
    );
  }


  
  @UseGuards(AuthGuard)
  @Post('import-pdf/:id')
  @UseInterceptors(FileInterceptor('pdf'))
 async importPdf(@Param('id') folderId: string,@UploadedFile(
 new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^application\/pdf$/i
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
 ) file: Express.Multer.File,@Req() req) {
   if (!file) throw new BadRequestException('Pdf not found');
  //let pfdName;
      // if (file && file && file.originalname) {
        const ext = extname(file.originalname);
        const baseName= file.originalname.replace(ext, '');
        const fileName = baseName+`${Date.now()}`+ext;
        
        const filePath = `./uploads/pdf/${fileName}`;
        await fs.writeFile(filePath, file.buffer);
         //pfdName = fileName;
      //}
    // console.log( file.size);
  
  return this.filesUploadService.importPdf(
       fileName,
       file.size,
       filePath,
      folderId,
       ext,
       req.user.id 
    );
  }


    @UseGuards(AuthGuard)
  @Post('add-note/:id')
  @UseInterceptors(FileInterceptor('note'))
 async importNote(@Param('id') folderId: string,@UploadedFile( new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$|^text\/plain$/i
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),) file: Express.Multer.File,@Req() req) {
   if (!file) throw new BadRequestException('Note not found');
  //let pfdName;
      // if (file && file && file.originalname) {
        const ext = extname(file.originalname);
        const baseName= file.originalname.replace(ext, '');
        const fileName = baseName+`${Date.now()}`+ext;
        
        const filePath = `./uploads/notes/${fileName}`;
        await fs.writeFile(filePath, file.buffer);
         //pfdName = fileName;
      //}
    // console.log( file.size);
  
  return this.filesUploadService.importNote(
       fileName,
       file.size,
       filePath,
      folderId,
       ext,
       req.user.id 
    );
  }



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
