import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BiensService } from './biens.service';
import { BiensController } from './biens.controller';
import { BienImmobilier, BienImmobilierSchema } from './schemas/bien.schema';
import { MinioService } from '../minio.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: BienImmobilier.name, schema: BienImmobilierSchema }])],
  controllers: [BiensController],
  providers: [BiensService, MinioService],
  exports: [BiensService, MongooseModule], // export pour que transactions y ait accès
})
export class BiensModule {}
