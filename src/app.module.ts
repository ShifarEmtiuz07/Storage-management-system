import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Modules/users/users.module';
import { DatabaseModule } from './Database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Modules/auth/auth.module';
import { FoldersModule } from './Modules/folders/folders.module';
import { FilesUploadModule } from './Modules/files/files-upload.module';
import { HomeModule } from './Modules/home/home.module';
import { GoogleAuthModule } from './Modules/auth/google-auth.module';
import { FavoritesModule } from './Modules/favorites/favorites.module';
import { CalendarModule } from './Modules/calendar/calendar.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    FoldersModule,
    FilesUploadModule,
    HomeModule,
    GoogleAuthModule,
    FavoritesModule,
    CalendarModule,
    
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
