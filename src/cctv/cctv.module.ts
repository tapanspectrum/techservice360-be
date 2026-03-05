import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CctvController } from './cctv.controller';
import { CctvService } from './cctv.service';
import { Cctv, CctvSchema } from './schemas/cctv.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cctv.name, schema: CctvSchema }])],
  controllers: [CctvController],
  providers: [CctvService],
  exports: [CctvService],
})
export class CctvModule {}
