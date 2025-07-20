import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';

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
      throw new InternalServerErrorException('Single user retrieve error: ' + error.message);
    }
  }


async  remove(id: number) {
     const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`User with id:${id} not found`);
      }
      await this.userRepo.remove(user);
     return {
        statusCode: 200,
        message: `User with id:${id} deleted successfully`,
       
      };
  }
}
