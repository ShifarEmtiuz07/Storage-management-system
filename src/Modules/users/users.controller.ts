import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseFilePipe, UploadedFile, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,   @InjectRepository(User)
        private userRepo: Repository<User>,) {}

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
      
      const filePath = `./uploads/userProfile/${fileName}`;
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
  @UseInterceptors(FileInterceptor('userImage'))
 async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto,  @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )file: Express.Multer.File) {
          const user = await this.userRepo.findOne({ where: { id } });
          if (!user) throw new NotFoundException('User not found');

          
    //if one and only when files && database has user image then delete the database user previous image
      let userImage;
    if (file && file.originalname && user.userImage) {
      const filePath = `./uploads/userProfile/${user.userImage}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const ext = extname(file.originalname);
      const fileName = (updateUserDto.username? updateUserDto.username:user.username)+ext;
      
      const newFilePath = `./uploads/userProfile/${fileName}`;
      await fs.writeFile(newFilePath, file.buffer);
       userImage = fileName;
    }


    return this.usersService.update(+id, {...updateUserDto,userImage});
  }



  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id',) id: number) {
    return this.usersService.deleteUser(id);
  }
}
