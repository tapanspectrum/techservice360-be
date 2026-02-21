import { Module } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Repair, RepairSchema } from './schemas/repair.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Repair.name, schema: RepairSchema }])],
  controllers: [RepairsController],
  providers: [RepairsService],
})
export class RepairsModule {}
