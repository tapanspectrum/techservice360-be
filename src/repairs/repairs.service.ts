import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repair } from './schemas/repair.schema';
import { CreateRepairDto } from './dto/create-repair.dto';

@Injectable()
export class RepairsService {
  constructor(@InjectModel(Repair.name) private repairModel: Model<Repair>) {}

  findAll(tenantId: string) {
    return this.repairModel.find({ tenantId }).exec();
  }

  create(createRepairDto: CreateRepairDto) {
    return this.repairModel.create(createRepairDto);
  }
}
