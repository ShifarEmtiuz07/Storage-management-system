import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class UsersService {

   constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

    async register(createUserDto: CreateUserDto) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const password_hash = bcrypt.hashSync(createUserDto.password, salt);
      const user = await this.userRepo.create({ ...createUserDto, password_hash });
    
     const savedUser= await this.userRepo.save(user);
    
      return {
        statusCode: 201,
        message: 'Registration successful',
        data: savedUser
      };
    } catch (error) {
      throw new InternalServerErrorException('User register error: ' + error.message);
    }
  }


   async findByGoogleId(googleId: string) {
    try{
         const user= this.userRepo.findOne({ where: { googleId } });
    if(!user) throw new NotFoundException(`User  not found`);
    return user;
    }catch(error){
      throw new InternalServerErrorException(error.message);
    }
 
  }

  async createGoogleUser(profile: {
    id: string;
    email: string;
    username: string;
    picture: string;
  }): Promise<User> {
    let user = await this.findByGoogleId(profile.id);

    if (!user) {
      user = this.userRepo.create({
        googleId: profile.id,
        email: profile.email,
        username: profile.username,
        userImage: profile.picture,
      });
      await this.userRepo.save(user);
    }

    return user;
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      return {
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: plainToInstance(User, users),
      };
    } catch (error) {
      throw new InternalServerErrorException('User retrieve error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`User with id:${id} not found`);
      }
      return {
        statusCode: 200,
        message: `User with id:${id} retrieved successfully`,
        user: plainToInstance(User, user),
      };
    } catch (error) {
      throw new InternalServerErrorException('Single user retrieve error: ' + error.message);
    }
  }

    async update(id: number, updateUsertDto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, updateUsertDto);

      await this.userRepo.save(user);

      return {
        statusCode: 200,
        message: 'User updated successful',
         data: plainToInstance(User, user),
      };
    } catch (error) {
      throw new InternalServerErrorException('User update error: ' + error.message);
    }
  }



    async deleteUser(userId: number): Promise<{ message: string }> {   
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['folders', 'files'], 
    });

    if (!user) throw new NotFoundException('User not found');

        
      const profileImagePath = `./uploads/userProfile/${user.userImage}`;

      if (fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
      }


    for (const file of user.files) {
      const filePath = file.path;
    
      if (fs.existsSync(filePath)) {
          console.log(filePath)
        fs.unlinkSync(filePath); 
     
      }
    }
    


    await this.userRepo.remove(user);         ////***  Cascade deletes all the users related folders and files ******////////

    return { message: 'User and all related data deleted successfully' };
  }
}


