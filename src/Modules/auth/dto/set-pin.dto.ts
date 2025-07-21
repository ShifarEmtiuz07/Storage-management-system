import {  IsString, MinLength } from 'class-validator';

export class SetPinDto {

  @IsString()
  password: string;

  @IsString()
  @MinLength(4)
  pin: string;
}
