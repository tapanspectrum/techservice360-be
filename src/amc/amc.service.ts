import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';
import { Amc } from './schemas/amc.schema';

@Injectable()
export class AmcService {
  constructor(@InjectModel(Amc.name) private amcModel: Model<Amc>) {}

  create(createAmcDto: CreateAmcDto) {
    const createdAmc = new this.amcModel(createAmcDto);
    return createdAmc.save();
  }

  findAll() {
    return this.amcModel.find().exec();
  }

  findOne(id: string) {
    return this.amcModel.findById(id).exec();
  }

  update(id: string, updateAmcDto: UpdateAmcDto) {
    return this.amcModel.findByIdAndUpdate(id, updateAmcDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.amcModel.findByIdAndDelete(id).exec();
  }

  findByClient(clientId: string) {
    return this.amcModel.find({ clientId }).exec();
  }

  findByStatus(status: string) {
    return this.amcModel.find({ status }).exec();
  }
}
