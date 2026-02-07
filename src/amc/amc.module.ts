import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';
import { Amc, AmcSchema } from './schemas/amc.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Amc.name, schema: AmcSchema }])],
  controllers: [AmcController],
  providers: [AmcService],
  exports: [AmcService],
})
export class AmcModule {}
