import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Req, ParseFilePipeBuilder, HttpStatus, Query } from '@nestjs/common';
import { FilesUploadService } from './files-upload.service';
import { CreateFilesUploadDto } from './dto/create-files-upload.dto';
import { UpdateFilesUploadDto } from './dto/update-files-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';

@Controller('files')
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
       req.user.sub
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
       req.user.sub 
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
       req.user.sub 
    );
  }


  @UseGuards(AuthGuard)
  @Post('rename')
  renameFile(@Body() body ) {
    const{fileId,newName }= body;
    return this.filesUploadService.renameFile(fileId,newName);
  }

   @UseGuards(AuthGuard)
  @Post('copy-file')
  copyFileToFolder(@Body() body ) {
    const{fileId,targetFolderId }= body;
    return this.filesUploadService.copyFileToFolder(fileId,targetFolderId);
  }

  
   @UseGuards(AuthGuard)
  @Post('duplicate-file/:id')
  duplicateFile(@Param ('id') id:string ) {
    
    return this.filesUploadService.duplicateFile(+id);
  }


  @UseGuards(AuthGuard)
  @Post('favorite/:id')
  makeFavorite(@Param ('id') id:string, @Req() req) {
    
    return this.filesUploadService.makeFavorite(+id, req.user.sub);
  }

  
  @UseGuards(AuthGuard)
  @Post('unfavorite/:id')
  makeUnFavorite(@Param ('id') id:string, @Req() req) {
    
    return this.filesUploadService.makeUnFavorite(+id, req.user.sub);
  }


  
  @UseGuards(AuthGuard)
  @Get('favorite-files')
  findFavoriteFiles(@Query('searchTerm') searchTerm:string, @Req() req) {
    
    return this.filesUploadService.findFavoriteFiles(searchTerm,req.user.sub);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesUploadService.remove(+id);
  }


  @UseGuards(AuthGuard)
  @Get('notes')
  findAllNotes(@Query('searchTerm') searchTerm:string,@Req() req) {
    return this.filesUploadService.findAllNotes(searchTerm,req);
  }

   @UseGuards(AuthGuard)
  @Get('images')
  findAllImages(@Query('searchTerm') searchTerm:string,@Req() req) {
    return this.filesUploadService.findAllImages(searchTerm,req);
  }


   @UseGuards(AuthGuard)
  @Get('pdfs')
  findAllPdfs(@Query('searchTerm') searchTerm:string,@Req() req) {
    return this.filesUploadService.findAllPdfs(searchTerm,req);
  }

  @UseGuards(AuthGuard)
  @Post('make-private')
  makeFilePrivate(@Body() body,@Req() req ) {
    const{fileId,pin }= body;
    return this.filesUploadService.makeFilePrivate(fileId,pin,req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('private')
  findPrivateFiles(@Body() body,@Req() req ) {
    
    return this.filesUploadService.findPrivateFiles(body.pin,req.user.sub);
  }

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
    

  return this.filesUploadService.dateFilteredFiles(req, parsedDate);
}




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesUploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilesUploadDto: UpdateFilesUploadDto) {
    return this.filesUploadService.update(+id, updateFilesUploadDto);
  }


}
