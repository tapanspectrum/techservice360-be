import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { Repair, RepairDocument } from './schemas/repair.schema';

@Injectable()
export class RepairsService {
  constructor(
    @InjectModel(Repair.name) private readonly repairModel: Model<RepairDocument>,
  ) {}

  create(createRepairDto: CreateRepairDto) {
    const repair = new this.repairModel(createRepairDto);
    return repair.save();
  }

  findAll() {
    return this.repairModel.find().exec();
  }

  findOne(id: string) {
    return this.repairModel.findById(id).exec();
  }

  update(id: string, updateRepairDto: UpdateRepairDto) {
    return this.repairModel
      .findByIdAndUpdate(id, updateRepairDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.repairModel.findByIdAndDelete(id).exec();
  }
}
