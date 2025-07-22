import { PartialType } from '@nestjs/mapped-types';
import { CreateFilesUploadDto } from './create-files-upload.dto';

export class UpdateFilesUploadDto extends PartialType(CreateFilesUploadDto) {}
