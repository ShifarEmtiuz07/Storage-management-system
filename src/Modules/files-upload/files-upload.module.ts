import { Module } from '@nestjs/common';
import { FilesUploadService } from './files-upload.service';
import { FilesUploadController } from './files-upload.controller';

@Module({
  controllers: [FilesUploadController],
  providers: [FilesUploadService],
})
export class FilesUploadModule {}
