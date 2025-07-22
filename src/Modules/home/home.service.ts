import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { Files } from '../files/entities/files-upload.entity';
import { User } from '../users/entities/user.entity';
import { FilesUploadService } from '../files/files-upload.service';


@Injectable()
export class HomeService {

     private readonly MAX_STORAGE = 15; // GB
     constructor( @InjectRepository(Folder)
        private folderRepo: Repository<Folder>,
        @InjectRepository(Files)
        private fileRepo: Repository<Files>,
         @InjectRepository(User)
        private userRepo: Repository<User>,
        private readonly filesUploadService: FilesUploadService
      ){}

 async storageProfile(req){

  try{
          const user = await this.userRepo.findOne({ where: { id:  req.user.sub } });
       if (!user) throw new NotFoundException('User not found');


        const used = await this.filesUploadService.getUsedStorage(user.id);
        const totalUsed= used.usedGB+' GB';
         const availableGB= used.availableGB+' GB';
         const totalStorageGB=used.totalStorageGB+' GB';


         return {
        statusCode: 200,
        message: 'Profile storage retrieved successful',
        data: {totalStorageGB,totalUsed,availableGB}
      };
  }catch(error){
    throw new InternalServerErrorException('Profile storage retrieved error'+error.message);
  }

 
 }


 async getFoldersWithItems(req) {
   try{

     const user = await this.userRepo.findOne({ where: { id:  req.user.sub } });
    
    if (!user) throw new NotFoundException('User not found');
  const folders = await this.folderRepo
    .createQueryBuilder('folder')
    .leftJoin('folder.files', 'file')
    .leftJoin('folder.user', 'user')
    .select('folder.id', 'id')
    .addSelect('folder.name', 'name')
    .addSelect('COUNT(file.id)', 'totalItems')
    .addSelect('COALESCE(SUM(file.size), 0)', 'size') // in bytes
    .where('user.id = :userId', { userId:user.id })
    .groupBy('folder.id')
    .getRawMany();

 
  return folders.map(f => ({
    id: f.id,
    name: f.name,
    totalItem: Number(f.totalItems),
    storageInGB: +(Number(f.size) / (1024 ** 3)).toFixed(4),        /////////Convert Byte to GB//
    sizeInBytes: Number(f.size),
    sizeInMB: +(Number(f.size) / (1024 ** 2)).toFixed(2),         /////////Convert Byte to MB//
  }));

   }catch(error){
    throw new InternalServerErrorException('Folders with items retrieve error: '+error.message)
   }
}

async getRecentFiles(req){

  try{

    const user = await this.userRepo.findOne({ where: { id:  req.user.sub } });
      //console.log(user);
    
    if (!user) throw new NotFoundException('User not found');

     let dateWhereClause = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date();
    end.setHours(23, 59, 59, 999);
   dateWhereClause = {  created_at: Between(today, end)
  };

  const qb = await this.fileRepo.createQueryBuilder('files')
              .select('files.id','id')
             .addSelect('files.name','name')
              .addSelect('files.created_at','created_at')
             .leftJoin('files.user','user')
             .where('user.id = :userId', { userId:user.id })
            .andWhere(dateWhereClause)
            .getRawMany();

            // console.log(qb);
                
            return {
        statusCode: 200,
        message: 'Recent files retrieved successful',
        data: qb
      };

  }catch(error){
    throw new InternalServerErrorException('Recent files retrieve error: '+error.message)
  }

      

}





  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  findAll() {
    return `This action returns all home`;
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

  update(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  remove(id: number) {
    return `This action removes a #${id} home`;
  }
}
