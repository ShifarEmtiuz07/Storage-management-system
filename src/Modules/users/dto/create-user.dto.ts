import { IsBoolean, IsEmail, IsString } from "class-validator";


export class CreateUserDto {

    @IsString({ message: 'Username must be a string' })
    username: string;

   @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;

    @IsString({ message: 'Confirm password must be a string' })
    confirmPassword?: string;

    @IsBoolean({ message: 'Terms and conditions must be a boolean' })
    termsConditions?: boolean;
}
