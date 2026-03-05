import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairsController } from './repairs.controller';
import { RepairsService } from './repairs.service';
import { Repair, RepairSchema } from './schemas/repair.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Repair.name, schema: RepairSchema }])],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService],
})
export class RepairsModule {}
