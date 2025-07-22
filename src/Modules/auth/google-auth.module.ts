// google-auth.module.ts
import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
    imports:[UsersModule,TypeOrmModule.forFeature([User])],
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}
