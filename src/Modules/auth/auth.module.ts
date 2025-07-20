import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PasswordReset } from './entities/password-reset.entity';
import { MailService } from './mail.service';

@Module({
    imports: [
    TypeOrmModule.forFeature([User,PasswordReset]),
    JwtModule.registerAsync({
       imports: [ConfigModule.forRoot()],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') } 
      }),
       inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService],
})
export class AuthModule {}
