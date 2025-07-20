import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseFilePipe, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
@UseInterceptors(FileInterceptor('userImage'))
async  create(@Body() createUserDto: CreateUserDto, 
   @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )file: Express.Multer.File) {

      let userImage;
      
    if (file && file && file.originalname) {
      const ext = extname(file.originalname);
      const fileName = createUserDto.username+ext;
      
      const filePath = `./uploads/${fileName}`;
      await fs.writeFile(filePath, file.buffer);
       userImage = fileName;
    }
   

   
    return this.usersService.register({...createUserDto,userImage});
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
