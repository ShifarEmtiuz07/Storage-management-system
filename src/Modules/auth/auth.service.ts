import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { PasswordReset } from './entities/password-reset.entity';
import { MailService } from './mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
 
   constructor(@InjectRepository(User) private readonly userRepo:Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private passwordResetRepo: Repository<PasswordReset>,
        private mailService: MailService,
  ){}
 
  async login(createAuthDto: CreateAuthDto): Promise<{ access_token: string }> {

  try{
    const user=await this.userRepo.findOne({where:{email:createAuthDto.email}})
     if(!user){
            throw new NotFoundException("User not found");
      }
      const isValid=await bcrypt.compare(createAuthDto.password,user.password_hash);
      if(!isValid){
         throw new UnauthorizedException('Invalid credentials');
      }
        const payload = { sub: user.id, username: user.username };  //user_role:user.user_role
        const access_token= await this.jwtService.signAsync(payload);

     return {access_token};
    
  }catch(error){
    throw new InternalServerErrorException("Login error: "+error.message)
  }

    
  }

  async forgotPassword(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  await this.passwordResetRepo.save({
    email,
    otp,
    expiresAt,
    isVerified: false,
  });

  await this.mailService.sendOtpEmail(email, otp);

  return { message: 'OTP sent to email' };
}

async verifyOtp({ email, otp }: VerifyOtpDto) {
  const record = await this.passwordResetRepo.findOne({ where: { email, otp } });

  if (!record) throw new BadRequestException('Invalid OTP');

  if (record.isVerified) throw new BadRequestException('OTP already used');

  if (new Date() > record.expiresAt) {
    await this.passwordResetRepo.delete({ id: record.id });
    throw new BadRequestException('OTP expired');
  }

  record.isVerified = true;
  await this.passwordResetRepo.save(record);

  return { message: 'OTP verified' };
}

  async resetPassword(dto: ResetPasswordDto) {
    const { email, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const record = await this.passwordResetRepo.findOne({ where: { email, isVerified: true } });
    if (!record) throw new BadRequestException('OTP not verified');

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(newPassword, salt);
    await this.userRepo.update({ email }, { password_hash: password_hash });

    await this.passwordResetRepo.delete({ email }); 

    return { message: 'Password reset successfully' };
  }

async setPin(dto,userId) {  //userId: number, pin: string, password:string
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found'); 




  const isValid = await bcrypt.compare(dto.password, user.password_hash);
  if (!isValid) throw new UnauthorizedException('Invalid password');

   const salt = bcrypt.genSaltSync(10);
   const pin_hash = bcrypt.hashSync(dto.pin, salt);

  user.pin_code = pin_hash;
  await this.userRepo.save(user);
 
         return {
        statusCode: 200,
        message: 'Pin set successfully' ,
       
      };

}



  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
