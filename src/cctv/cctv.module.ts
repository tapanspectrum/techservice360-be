import { Module } from '@nestjs/common';
import { CctvService } from './cctv.service';
import { CctvController } from './cctv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cctv, CctvSchema } from './schemas/cctv.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cctv.name, schema: CctvSchema }])],
  controllers: [CctvController],
  providers: [CctvService],
  exports: [CctvService],
})
export class CctvModule {}
