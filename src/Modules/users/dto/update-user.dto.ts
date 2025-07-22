import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto  {
    @IsString()
    username:string;

     @IsString()
    userImage:string;

    
}
